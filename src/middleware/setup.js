import { getEnvVars as getFirebaseEnvVars } from './firebase/firebaseEnv';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import firebase from 'firebase/app';

export function getProviderEnvVars() {
  if (getProvider() === FIREBASE) {
    return getFirebaseEnvVars();
  }
  console.error('getProvider', getProvider);
  return console.error('No provider selected', getProvider());
}

export function setup() {
  if (getProvider() === FIREBASE && !firebase.apps.length) {
    const firebaseConfig = require(process.env.RUNNING_ENV != 'production'
      ? './firebase/firebaseConfig.staging.js'
      : './firebase/firebaseConfig.production.js').firebaseConfig;
    firebase.initializeApp(firebaseConfig);
  }
}
