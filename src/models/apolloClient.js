import { ApolloClient, InMemoryCache } from '@apollo/client';
import { isNode } from '../utils/utilities';
if (isNode() && !global.fetch) {
  //no fetch
  global.fetch = require('node-fetch');
}

console.log('TODO: GET URI FROM MIDDLEWARE');
const client = new ApolloClient({
  //uri: 'https://us-central1-mokuroku-staging.cloudfunctions.net/graphql/api',
  uri: 'http://localhost:5001/mokuroku-staging/us-central1/graphql/api',
  cache: new InMemoryCache(),
});

export default client;
