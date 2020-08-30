import { SUCCESS_STATUS } from '../../models/constants';
import firebase from 'firebase/app';
import 'firebase/auth';

export function firebaseSignup({ email, password }) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      res.status = SUCCESS_STATUS;
      return res;
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('FIREBASE AUTH: error while creating user', error);

      // ...
    });
}

export function firebaseRemoveCurrentUser() {
  const user = firebase.auth().currentUser;
  return user
    .delete()
    .then(function() {
      // User deleted.
    })
    .catch(function(error) {
      // An error happened.
      console.log('FIREBASE AUTH: error while removing user', error);
    });
}
