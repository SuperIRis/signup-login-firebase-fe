import { getProviderConfig } from '../middleware/setup';
export function getFBAppId() {
  return getProviderConfig().facebook.appId;
}
