import { firebaseSignup, firebaseRemoveCurrentUser } from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import client from '../models/apolloClient';
import { gql } from '@apollo/client';

const ADD_USER = gql`
  mutation addUser($id: String!, $fullName: String!, $username: String!, $email: String!, $country: String!) {
    addUser(id: $id, fullName: $fullName, username: $username, email: $email, country: $country) {
      id
      username
      email
    }
  }
`;

export function signup(data) {
  console.log('signup');
  return firebaseSignup(data).then((res) => {
    console.log('ress:::::', res);
    console.log('auth confirmed, let´s save user', { ...data, id: res.user.uid });
    console.log('TODO: Save idToken');
    client.mutate({
      mutation: ADD_USER,
      variables: { ...data, id: res.user.uid },
    });
  });
}

export function removeCurrentUser() {
  if (getProvider() === FIREBASE) {
    return firebaseRemoveCurrentUser();
  }
}
