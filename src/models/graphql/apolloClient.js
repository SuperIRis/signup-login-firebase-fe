import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { isNode } from '../../utils/utilities';
import { getGraphQLEndpointURI } from '../../middleware/config';
if (isNode() && !global.fetch) {
  //no fetch
  global.fetch = require('node-fetch');
}

const httpLink = new HttpLink({
  uri: getGraphQLEndpointURI(),
  fetch: global.fetch,
  credentials: 'include',
});

let appJWTToken;
export const setJWTToken = (token) => {
  appJWTToken = token;
};

//If there is a JWT authorization token, let's include it in the call so we can validate the user session
const authMiddleware = new ApolloLink((operation, forward) => {
  if (appJWTToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${appJWTToken}`,
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  //uri: getGraphQLEndpointURI(),
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default client;
