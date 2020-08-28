import { firebaseSignup } from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';

export function signup(data) {
  if (getProvider() === FIREBASE) {
    return firebaseSignup(data);
  }
}
