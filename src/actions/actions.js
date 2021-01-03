import {
  SIGNUP_REQUEST,
  SENDING_REQUEST,
  SET_AUTH,
  LOGIN_REQUEST,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  SET_ERROR,
  CLEAR_ERROR,
  LOGOUT_REQUEST,
  RESET_PASSWORD_REQUEST,
  SET_RESPONSE,
  RECOVER_PASSWORD_REQUEST,
  VERIFY_RESET_PASSWORD_REQUEST,
} from './constants';

/**
 * Sets the `currentlySending` state, which displays loading indicator during requests
 * @param {boolean} sending       if true, a request is being sent
 */
export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}

/**
 * Sets authentication state
 * @param {boolean} loggedState   true if user is logged in
 */
export function setAuthState(loggedState) {
  return { type: SET_AUTH, loggedState };
}
/**
 * Sets success state after a successful request
 * @param {boolean} success   true if user is logged in
 */
export function setResponse(success) {
  return { type: SET_RESPONSE, success };
}

/**
 * We want to logout a user
 */
export function logoutRequest() {
  return { type: LOGOUT_REQUEST };
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
 * We want to change the user's password
 * @param {object} data           data used for login the user
 * @param {string} data.password  user's password
 */

export function resetPasswordRequest(data, mock) {
  return { type: RESET_PASSWORD_REQUEST, data, mock };
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

/**
 * Sets the error state to the error received
 * @param {object}  error         the error received
 * @param {string}  error.error   the error message
 */
export function setError(error) {
  return { type: SET_ERROR, error };
}

/**
 * Clears the error state
 */
export function clearError(error) {
  return { type: CLEAR_ERROR };
}
