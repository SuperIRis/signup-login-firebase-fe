import { gql } from '@apollo/client';
import client from '../apolloClient';

const ADD_USER = gql`
  mutation addUser(
    $id: ID!
    $fullName: String!
    $username: String!
    $email: String!
    $country: String!
    $socialId: String
    $providerId: String
    $birthDate: Date
  ) {
    addUser(
      id: $id
      fullName: $fullName
      username: $username
      email: $email
      country: $country
      socialId: $socialId
      providerId: $providerId
      birthDate: $birthDate
    ) {
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
