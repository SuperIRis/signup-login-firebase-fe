import errorDictionary from '../../models/errorDictionary';
import firebase from 'firebase/app';
import 'firebase/auth';

export function firebaseSignup({ email, password }) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // For full list of errors check https://firebase.google.com/docs/reference/js/firebase.auth.Auth
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = errorDictionary.EMAIL_ALREADY_IN_USE;
      }
      throw new Error(errorMessage);
    });
}

function firebaseLoginFacebook(facebook) {
  const { response } = facebook;
  /*firebase.auth().onAuthStateChanged((firebaseUser) => {
    console.log('----------- on auth state changed:', firebaseUser);
  });
  */
  const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
  return firebase
    .auth()
    .signInWithCredential(credential)
    .catch((error) => {
      console.log('error!', error);
    });
}

export function firebaseLoginWithSM(data) {
  if (data.response) {
    //if response exists, it is a facebook login
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
