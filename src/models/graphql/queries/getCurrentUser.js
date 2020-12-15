//KC8BUOssHlbwTuoDNzuEj2KKj6D3
import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_CURRENT_USER = gql`
  query CURRENT_USER($idToken: String!) {
    currentUser(idToken: $idToken) {
      username
      email
    }
  }
`;

const getCurrentUser = (idToken) => {
  return client.query({
    query: GET_CURRENT_USER,
    variables: { idToken },
  });
};

export default getCurrentUser;
