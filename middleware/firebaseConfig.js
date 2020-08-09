export const FIREBASE = 'FIREBASE';

let firebaseEnvVars = {};

export function getEnvVars() {
  if (process.env.BUILD_TARGET && process.env.BUILD_TARGET === 'server') {
    const functions = require('firebase-functions');
    firebaseEnvVars = functions.config() ? functions.config() : {};
  } else if (window.__PROVIDER_CONFIG__) {
    firebaseEnvVars = window.__PROVIDER_CONFIG__;
    delete window.__PROVIDER_CONFIG__;
  }
  return firebaseEnvVars;
}
