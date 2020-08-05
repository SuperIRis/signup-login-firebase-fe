export const FIREBASE = 'FIREBASE';
let providerConfig;

export function getProvider() {
  return FIREBASE;
}

export function getProviderConfig() {
  if (getProvider() === FIREBASE) {
    if (process.env.BUILD_TARGET && process.env.BUILD_TARGET === 'server') {
      const functions = require('firebase-functions');
      console.log('functions', functions.config());
      console.log('GCLOUD', process.env.GCLOUD_PROJECT);
      return functions.config();
    } else {
      if (!providerConfig) {
        providerConfig = window.__PROVIDER_CONFIG__;
        //delete window.__PROVIDER_CONFIG__;
      }
      return providerConfig;
    }
  }
}
