import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import request from '../../models/request';
import { errorsMessagesDictionary } from '@mokuroku/mokuroku-commons/dictionaries/errors';
import {
  signup as middlewareSignup,
  login as middlewareLogin,
  logout as middlewareLogout,
  verifyUserForSignup as middlewareVerifyUserForSignup,
  removeUser as middlewareRemoveUser,
  recoverPassword as middlewareRecoverPassword,
  verifyResetPasswordRequest as middlewareVerifyResetPasswordRequest,
} from '../../middleware/auth';
import getCurrentUser from '../../models/graphql/queries/getCurrentUser';
//import removeUser from './graphql/mutations/removeUser';

const host = `https://${process.env.HOST}:${Number(process.env.PORT)}/`;
// we are saving the token in local storage
let localStorage;
if (global.process && process.env.NODE_ENV) {
  //polyfill for testing
  localStorage = require('localStorage');
} else {
  localStorage = global.window.localStorage;
}

const auth = {
  /**
   * Authorizing by login the user
   * Either username + password OR user + response (facebook)
   * @param {string} username           User's username
   * @param {string} password           User's password
   * @param {number} loginAttempts      Number of times user has attempted to login in this session
   * @param {object} user               User's data from facebook
   * @param {object} response           Response object obtained from facebook login / init
   */
  login(data, mock) {
    return middlewareLogin(data);
    const mockEndpoint = mock === 'error' ? host + 'mock/error.json' : host + 'mock/login.json';
    const realEndpoint = host + '/mock/login.json'; //update with real endpoint once ready
    const endpoint = process.env.NODE_ENV === 'development' && mock ? mockEndpoint : realEndpoint;
    return request.post(endpoint, { username, password, fbid }).then((res) => {
      if (res && res.status === SUCCESS_STATUS) {
        if (res.result && res.result.token) {
          localStorage.token = res.result.token;
          localStorage.username = res.result.username || '';
          if (remember) {
            localStorage.persistent = true;
          }
        }
        return Promise.resolve({ loginAttempts, ...res });
      } else {
        return Promise.reject({
          raw: res.error,
          message: errorsMessagesDictionary[res.error],
          loginAttempts,
        });
      }
    });
  },

  recoverPassword(data) {
    return middlewareRecoverPassword(data);
  },

  verifyResetPasswordRequest(data) {
    return middlewareVerifyResetPasswordRequest(data);
  },

  /**
   * Logout user
   */
  logout() {
    return middlewareLogout();
  },

  /**
   * Verifying user for Signup
   * When using social media auth, verifying if user already exists so we can log them in instead of registering a new user
   * Either username + password OR user + response (facebook)
   * @param {object} data.user               User's data from facebook
   * @param {object} data.response           Response object obtained from facebook login / init
   */
  verifyUserForSignup(data) {
    return middlewareVerifyUserForSignup(data);
  },

  /**
   * Authorizing by signing up user
   * @param {string} username  User's username
   * @param {string} password  User's password
   * @param {string} email     User's email (only register)
   * @param {string} country   User's country (only register)
   * @param {string} name      User's name (only register)
   */
  signup(data, mock) {
    if (mock && process.env.NODE_ENV === 'development') {
      const { username, password, email, country, fullName } = data;
      const mockEndpoint = mock === 'error' ? 'mock/error.json' : 'mock/signup.json';
      return request
        .post(mockEndpoint, {
          username,
          password,
          email,
          country,
          fullName,
        })
        .then((res) => {
          if (res && res.status === SUCCESS_STATUS) {
            return auth.login({ username, password }, 'mock-response');
          } else {
            return Promise.reject({
              errorRaw: res && res.error ? res.error : res,
              error: res && res.error ? errorsMessagesDictionary[res.error] : 'No response',
            });
          }
        });
    } else {
      return middlewareSignup(data);
    }
  },

  /**
   * Authenticating users that have an active session
   */
  /**
   * @todo "Remember me" functionality, with a token in localStorage
   */
  checkIfUserIsAuthenticated(idToken, mock) {
    if (mock && process.env.NODE_ENV === 'development') {
      const mockEndpoint = mock === 'error' ? host + 'mock/error.json' : host + 'mock/auth.json';
      return request.post(mockEndpoint).then((res) => {
        if (res && res.status === SUCCESS_STATUS) {
          return Promise.resolve(res);
        } else {
          return Promise.reject(res.error);
        }
      });
    } else {
      return getCurrentUser(idToken);
    }
  },
  removeUser() {
    return middlewareRemoveUser();
  },
};

export default auth;
