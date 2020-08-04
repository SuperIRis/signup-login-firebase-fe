export const FIREBASE = 'FIREBASE';
let providerConfig;

export function getProviderConfig() {
  if (getProvider() === FIREBASE) {
    if (process.env.BUILD_TARGET && process.env.BUILD_TARGET === 'server') {
      const functions = require('firebase-functions');
      return functions.config();
    }
  } else {
    if (!providerConfig) {
      providerConfig = window.__PROVIDER_CONFIG__;
      delete windows.__PROVIDER_CONFIG__;
    }
    return providerConfig;
  }
}

export function getProvider() {
  return FIREBASE;
}
