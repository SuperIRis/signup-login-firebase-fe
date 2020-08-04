import { getProvider, FIREBASE } from './setup';
import { getFBAppId as firebaseGetFBAppId } from './firebaseConfig';
const PROVIDER = getProvider();

export function getFBAppId() {
  console.log(process.env.RAZZLE_FB_APPID);
  if (process.env.RAZZLE_FB_APPID) {
    return process.env.RAZZLE_FB_APPID;
  } else if (PROVIDER === FIREBASE) {
    return firebaseGetFBAppId();
  } else {
    return undefined;
  }
}
