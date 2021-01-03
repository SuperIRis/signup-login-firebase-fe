import firebase from 'firebase/app';
import 'firebase/auth';

export function firebaseResetPassword(actionCode, newPassword) {
  //return Promise.reject(new Error('Nope this doesn´t work'));
  return firebase.auth().confirmPasswordReset(actionCode, newPassword);
}
