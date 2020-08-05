import { getProviderConfig, getProvider } from '../middleware/setup';
export function getFBAppId() {
  return getProviderConfig().facebook ? getProviderConfig().facebook.appid : 'NOPE';
}
