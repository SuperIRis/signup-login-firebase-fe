import { gql } from '@apollo/client';
import client from '../apolloClient';

const LOGOUT_USER = gql`
  mutation logoutUser {
    logoutUser {
      status
      message
    }
  }
`;

const logoutUser = () => {
  return client.mutate({
    mutation: LOGOUT_USER,
  });
};

export default logoutUser;
