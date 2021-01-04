import {
  SIGNUP_REQUEST,
  LOGIN_REQUEST,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  LOGOUT_REQUEST,
  RECOVER_PASSWORD_REQUEST,
  VERIFY_RESET_PASSWORD_REQUEST,
  SET_AUTH,
} from './userAuthConstants';

/**
 * We want to logout a user
 */
export function logoutRequest() {
  return { type: LOGOUT_REQUEST };
}

/**
 * Sets authentication state
 * @param {boolean} loggedState   true if user is logged in
 */
export function setAuthState(loggedState) {
  return { type: SET_AUTH, loggedState };
}

/**
 * We want to signup a user
 * @param {object} data            data used for signing up the user
 * @param {string} data.name       user's name
 * @param {string} data.username   user's username
 * @param {string} data.password   user's password
 * @param {string} data.email      user's email
 * @param {string} data.country    user's country
 */
export function signupRequest(data, mock) {
  return { type: SIGNUP_REQUEST, data, mock };
}

/**
 * We want to login a user
 * @param {object} data           data used for login the user
 * @param {string} data.username  user's username
 * @param {string} data.password  user's password
 * @param {string} data.fbid      user's facebook id
 */

export function loginRequest(data, mock) {
  return { type: LOGIN_REQUEST, data, mock };
}

/**
 * We want to request a password change
 * @param {object} data           data used for login the user
 * @param {string} data.email     user's email
 */

export function recoverPasswordRequest(data, mock) {
  return { type: RECOVER_PASSWORD_REQUEST, data, mock };
}

/**
 * We want to verify if a user exists before signing them up
 * @param {object} data           data used for login the user
 * @param {string} data.user      user's username
 * @param {string} data.response  user's password
 */

export function verifyUserForSignupRequest(data, mock) {
  return { type: VERIFY_USER_FOR_SIGNUP_REQUEST, data, mock };
}
/**
 * We want to verify if a user's password change request is valid
 * @param {object} data
 * @param {string} data.token      user's action
 */
export function verifyResetPasswordRequest(data, mock) {
  return { type: VERIFY_RESET_PASSWORD_REQUEST, data, mock };
}
