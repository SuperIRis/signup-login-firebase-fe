import { SUCCESS_STATUS } from '../../models/constants';
import firebase from 'firebase/app';
import 'firebase/auth';

export function firebaseSignup({ email, password }) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('FIREBASE AUTH: error while creating user', error);

      // ...
    });
}

export function firebaseRemoveUser() {
  const user = firebase.auth().currentUser;
  return user
    .delete()
    .then(() => {
      return Promise.resolve(user);
    })
    .catch(function(error) {
      // An error happened.
      console.log('FIREBASE AUTH: error while removing user', error);
    });
}
