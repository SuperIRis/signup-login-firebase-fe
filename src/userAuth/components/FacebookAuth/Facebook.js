//https://developers.facebook.com/docs/facebook-login/web
import { getFBAppId } from '../../../middleware/config';
let FB;
const verbose = false; //change to true to receive logs of FB API responses
const Facebook = {
  AUTHORIZED: 'connected',
  UNAUTHORIZED: 'not_authorized',
  UNKNOWN: 'unknown',
  UNINITIALIZED: 'uninitialized',
  appId: getFBAppId(),
  apiVersion: 'v6.0',
  status: 'uninitialized',
  loadSDK(d, s, id) {
    //load FB SDK
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  },
  init() {
    return new Promise((res, rej) => {
      if (typeof document === 'undefined') {
        rej({ error: 'FB Login not available on SSR' });
      } else if (!Facebook.appId) {
        rej({ error: 'FB App ID is missing' });
      } else {
        try {
          window.fbAsyncInit = function() {
            FB = global.FB;
            FB.init({
              appId: Facebook.appId,
              cookie: true,
              xfbml: true,
              version: Facebook.apiVersion,
            });
            FB.getLoginStatus(function(response) {
              Facebook.status = response.status;
              Facebook.response = response;
              if (response.status === Facebook.AUTHORIZED) {
                Facebook.getUserInfo()
                  .then((user) => res({ user, response }))
                  .catch((err) => rej(err));
              } else {
                res(response);
              }

              verbose && process.env.NODE_ENV === 'development' && console.log('Facebook init with status:', response);
            });
          };
          Facebook.loadSDK(document, 'script', 'facebook-jssdk');
        } catch (error) {
          rej(error);
        }
      }
    });
  },
  login() {
    return new Promise((res, rej) => {
      FB.login(
        function(response) {
          Facebook.status = response.status;
          Facebook.response = response;
          if (response.status === Facebook.AUTHORIZED) {
            Facebook.getUserInfo()
              .then((user) => res({ user, response }))
              .catch((err) => rej(err));
          } else {
            rej(response);
          }
          verbose && process.env.NODE_ENV === 'development' && console.log('Facebook login with status:', response);
        },
        { scope: 'public_profile,email' }
      );
    });
  },
  getUserInfo() {
    return new Promise((res, rej) => {
      try {
        FB.api('/me?fields=id,name,email', function(response) {
          Facebook.user = response;
          res(response);
          verbose && process.env.NODE_ENV === 'development' && console.log('Facebook user info with status:', response);
        });
      } catch (error) {
        console.error(error);
        rej(error);
      }
    });
  },
};

export default Facebook;
