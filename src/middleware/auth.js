import { firebaseSignup, firebaseRemoveCurrentUser } from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';

export function signup(data) {
  if (getProvider() === FIREBASE) {
    return firebaseSignup(data);
  }
}

export function removeCurrentUser() {
  if (getProvider() === FIREBASE) {
    return firebaseRemoveCurrentUser();
  }
}
