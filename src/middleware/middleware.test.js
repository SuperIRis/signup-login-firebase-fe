import { getEnvVars, FIREBASE } from './firebase/firebaseEnv';
import { getProviderEnvVars } from './setup';
import { getFBAppId } from './config';
import * as provider from './provider';

describe('Middleware', () => {
  const test = require('firebase-functions-test')(
    {
      /*databaseURL: 'https://my-project.firebaseio.com',
      storageBucket: 'my-project.appspot.com',*/
      projectId: 'mokuroku-staging',
    },
    '../../.firebase/mokuroku-staging-6d7ca1f7f75d.json'
  );
  process.env.BUILD_TARGET = 'test';
  test.mockConfig({ facebook: { appid: '123456' } });

  it('Firebase env variables exist', () => {
    expect(getEnvVars()).toEqual({ facebook: { appid: '123456' } });
  });
  it('Firebase env variables are returned if Firebase is provider', () => {
    jest.spyOn(provider, 'getProvider').mockImplementation(() => FIREBASE);
    expect(getProviderEnvVars()).toEqual({ facebook: { appid: '123456' } });
  });
  it('Returns local env var for Facebook ID if available', () => {
    expect(getFBAppId()).toEqual('747629475998176');
  });
  it('Returns provider env var for Facebook ID if no local env variable found for it', () => {
    delete process.env.RAZZLE_FB_APPID;
    expect(getFBAppId()).toEqual('123456');
  });
});
