import { getEnvVars as getFirebaseEnvVars } from './firebase/firebaseEnv';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import firebase from 'firebase/app';

const env = process.env.RAZZLE_RUNNING_ENV;

export function getProviderEnvVars() {
  if (getProvider() === FIREBASE) {
    return getFirebaseEnvVars();
  }
  console.error('getProvider', getProvider);
  return console.error('No provider selected', getProvider());
}

export function setup() {
  if (getProvider() === FIREBASE && !firebase.apps.length) {
    const firebaseConfig = require(env != 'production'
      ? './firebase/firebaseConfig.staging.js'
      : './firebase/firebaseConfig.production.js').firebaseConfig;
    firebase.initializeApp(firebaseConfig);
  }
}
