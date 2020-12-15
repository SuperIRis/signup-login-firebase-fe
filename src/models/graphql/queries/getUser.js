//KC8BUOssHlbwTuoDNzuEj2KKj6D3
import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_USER = gql`
  query USER($id: ID!) {
    user(id: $id) {
      username
      email
    }
  }
`;

const getUser = (id) => {
  console.log('get user', id);
  return client.query({
    query: GET_USER,
    variables: { id },
  });
};

export default getUser;
