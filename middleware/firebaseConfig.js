import { getProviderConfig, getProvider } from '../middleware/setup';
export function getFBAppId() {
  console.log('provider config', getProviderConfig());
  return getProviderConfig().facebook ? getProviderConfig().facebook.appid : 'NOPE';
}
