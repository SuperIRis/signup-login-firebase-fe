import { getEnvVars as getFirebaseEnvVars, FIREBASE } from './firebaseConfig';

export function getProvider() {
  //here is where we determine the provider
  return FIREBASE;
}

export function getProviderEnvVars() {
  if (getProvider() === FIREBASE) {
    return getFirebaseEnvVars();
  }
}
