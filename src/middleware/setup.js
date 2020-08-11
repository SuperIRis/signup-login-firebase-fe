import { getEnvVars as getFirebaseEnvVars, FIREBASE } from './firebaseConfig';
import { getProvider } from './provider';

export function getProviderEnvVars() {
  if (getProvider() === FIREBASE) {
    return getFirebaseEnvVars();
  }
}
