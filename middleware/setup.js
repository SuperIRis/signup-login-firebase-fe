export const FIREBASE = 'FIREBASE';
let providerConfig = {};

export function getProvider() {
  return FIREBASE;
}

export function getProviderConfig() {
  if (getProvider() === FIREBASE) {
    if (process.env.BUILD_TARGET && process.env.BUILD_TARGET === 'server') {
      const functions = require('firebase-functions');
      providerConfig = functions.config() ? functions.config() : {};
    } else if (window.__PROVIDER_CONFIG__) {
      providerConfig = window.__PROVIDER_CONFIG__;
      //delete window.__PROVIDER_CONFIG__;
    }
  }
  return providerConfig;
}
