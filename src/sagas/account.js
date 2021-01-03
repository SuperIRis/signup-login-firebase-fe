import { SENDING_REQUEST, SET_ERROR, RESET_PASSWORD_REQUEST, SET_RESPONSE } from '../actions/constants';
import { take, call, put, fork } from 'redux-saga/effects';
import account from '../models/account';

/*
  Sagas that handle user account (editing profile, changing/resetting password)
  Note: If you need to add another saga, you will need to import it from the main sagas.js file in this directory and include it in the root method
*/

/**
 * Reset user password
 */
export function* resetPasswordFlow() {
  while (true) {
    const request = yield take(RESET_PASSWORD_REQUEST);
    const data = request.data;
    const result = yield call(process, data, RESET_PASSWORD_REQUEST, request.mock);
    if (result) {
      yield put({ type: SET_RESPONSE, response: { origin: 'account', type: RESET_PASSWORD_REQUEST, ...result } });
    }
  }
}

/**
 * Handling authorizing calls
 * @param {object} data                 User's data
 * @param {string} accountRequestType   Needs to be included in requests object, pointing to an auth method
 * @param {string} mock                 Indicates if this is a mock call, doesn´t affect sagas just pass it through
 */

export function* process(data, accountRequestType, mock) {
  //We are sending a request, a chance to show loaders
  yield put({ type: SENDING_REQUEST, sending: true });
  let response;
  const requests = {
    RESET_PASSWORD_REQUEST: account.resetPassword,
  };
  try {
    if (!requests[accountRequestType]) {
      console.warn('accountRequestType not valid:', accountRequestType, requests, requests[accountRequestType]);
      throw new Error('accountRequestType not valid:', accountRequestType);
    }
    response = yield call(requests[accountRequestType], data, mock);
    return response;
  } catch (error) {
    yield put({
      type: SET_ERROR,
      error: { origin: 'account', type: accountRequestType, message: (error && error.message) || error },
    });
  } finally {
    yield put({ type: SENDING_REQUEST, sending: false });
  }
}
