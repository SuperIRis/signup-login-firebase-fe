import { getEnvVars as getFirebaseEnvVars } from './firebase/firebaseEnv';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import firebase from 'firebase/app';

export function getProviderEnvVars() {
  if (getProvider() === FIREBASE) {
    return getFirebaseEnvVars();
  }
}

export function setup() {
  if (getProvider() === FIREBASE) {
    const firebaseConfig = require(process.env.NODE_ENV != 'production'
      ? './firebase/firebaseConfig.staging.js'
      : './firebase/firebaseConfig.production.js').firebaseConfig;
    firebase.initializeApp(firebaseConfig);
  }
}
