import { gql } from '@apollo/client';
import client from '../apolloClient';

const REMOVE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const removeUser = (variables) => {
  return client.mutate({
    mutation: REMOVE_USER,
    variables: variables,
  });
};

export default removeUser;
