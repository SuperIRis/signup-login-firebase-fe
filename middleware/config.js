import { getProviderEnvVars } from './setup';

export function getFBAppId() {
  if (process.env.RAZZLE_FB_APPID) {
    //local dev
    return process.env.RAZZLE_FB_APPID;
  } else {
    //prod / staging env getting vars from cloud provider
    return getProviderEnvVars() && getProviderEnvVars().facebook && getProviderEnvVars().facebook.appid;
  }
}
