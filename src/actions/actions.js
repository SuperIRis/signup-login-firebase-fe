import { SENDING_REQUEST, SET_ERROR, CLEAR_ERROR, RESET_PASSWORD_REQUEST, SET_RESPONSE } from './constants';

/**
 * Sets the `currentlySending` state, which displays loading indicator during requests
 * @param {boolean} sending       if true, a request is being sent
 */
export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}

/**
 * Sets success state after a successful request
 * @param {boolean} success   true if user is logged in
 */
export function setResponse(success) {
  return { type: SET_RESPONSE, success };
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
