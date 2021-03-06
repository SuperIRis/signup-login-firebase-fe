import { errorsMessagesDictionary } from '@mokuroku/mokuroku-commons/dictionaries/errors';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import firebase from 'firebase/app';
import 'firebase/auth';
import { SOCIAL_AUTH_FACEBOOK } from '../../models/constants';

export function firebaseSignup({ email, password }) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // For full list of errors check https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_3
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = errorsMessagesDictionary.EMAIL_ALREADY_IN_USE;
      }
      throw new Error(errorMessage);
    });
}

export function firebaseLogin({ email, password }) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // For full list of errors check https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') {
        errorMessage = errorsMessagesDictionary.PASSWORD_INCORRECT;
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = errorsMessagesDictionary.USER_UNKNOWN;
      }
      throw new Error(errorMessage);
    });
}

export function firebaseLogout() {
  return firebase
    .auth()
    .signOut()
    .then((res) => {
      return { status: SUCCESS_STATUS };
    });
}

function firebaseLoginFacebook(facebook) {
  const { response } = facebook;
  const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
  return firebase
    .auth()
    .signInWithCredential(credential)
    .catch((error) => {
      console.log('error!', error);
    });
}

export function firebaseLoginWithSM(data) {
  if (data.loginMethod === SOCIAL_AUTH_FACEBOOK) {
    return firebaseLoginFacebook(data);
  }
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

export function firebaseRecoverPassword(data) {
  return firebase.auth().sendPasswordResetEmail(data.email);
}

export function firebaseVerifyResetPasswordRequest(oobCode) {
  return firebase.auth().verifyPasswordResetCode(oobCode);
}
