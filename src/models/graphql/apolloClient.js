import { ApolloClient, InMemoryCache } from '@apollo/client';
import { isNode } from '../../utils/utilities';
import { getGraphQLEndpointURI } from '../../middleware/config';
if (isNode() && !global.fetch) {
  //no fetch
  global.fetch = require('node-fetch');
}

const client = new ApolloClient({
  uri: getGraphQLEndpointURI(),
  cache: new InMemoryCache(),
});

export default client;
