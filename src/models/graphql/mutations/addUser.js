import { gql } from '@apollo/client';
import client from '../apolloClient';

const ADD_USER = gql`
  mutation addUser($id: String!, $fullName: String!, $username: String!, $email: String!, $country: String!) {
    addUser(id: $id, fullName: $fullName, username: $username, email: $email, country: $country) {
      id
      username
      email
    }
  }
`;

const addUser = (variables) => {
  return client.mutate({
    mutation: ADD_USER,
    variables: variables,
  });
};

export default addUser;
