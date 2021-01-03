import {
  SIGNUP_REQUEST,
  SENDING_REQUEST,
  SET_AUTH,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  SET_ERROR,
  SET_RESPONSE,
  RECOVER_PASSWORD_REQUEST,
  VERIFY_RESET_PASSWORD_REQUEST,
} from '../actions/constants';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import { take, call, put, fork } from 'redux-saga/effects';
import auth from '../models/auth';
import { errorsDictionary } from '@mokuroku/mokuroku-commons/dictionaries/errors';

/*
  Sagas that handle user authentication (signup, login, etc)
  Note: If you need to add another saga, you will need to import it from the main sagas.js file in this directory and include it in the root method
*/

/**
 * Login saga
 */
export function* loginFlow() {
  //this saga is always listening for actions
  //the while will not go infinite since as a generator this stops each yield
  let loginAttempts = 0;
  while (true) {
    // Listening for `LOGIN_REQUEST` actions and copying its payload to `data`
    const request = yield take(LOGIN_REQUEST);
    loginAttempts++;
    const data = { ...request.data, loginAttempts };

    // We call the `authorize` task with the data, and the type (since `authorize` also signs up)
    // Returns `true` if the login was successful, `false` if not
    const success = yield call(authorize, data, LOGIN_REQUEST, request.mock);

    if (success) {
      yield put({ type: SET_AUTH, loggedState: true }); // User is logged in (authorized) after being registered
    }
  }
}
/**
 * Signup saga
 */
export function* signupFlow() {
  //this saga is always listening for actions
  //the while will not go infinite since as a generator this stops each yield
  while (true) {
    const request = yield take(SIGNUP_REQUEST);
    const data = request.data;
    const result = yield call(authorize, data, SIGNUP_REQUEST, request.mock);
    if (result) {
      yield put({ type: SET_AUTH, loggedState: true }); // User is automatically logged in after successfuly signing up
    }
  }
}

/**
 * Logout saga
 */
export function* logoutFlow() {
  while (true) {
    yield take(LOGOUT_REQUEST);
    const result = yield call(authorize, {}, LOGOUT_REQUEST);
    if (result) {
      yield put({ type: SET_AUTH, loggedState: false });
    }
  }
}

/**
 * Verify if user is registered flow
 * This is to understand if the user can be registered with social media. This means they haven't been registered before
 */
export function* verifyUserForSignupFlow() {
  while (true) {
    const request = yield take(VERIFY_USER_FOR_SIGNUP_REQUEST);
    const data = request.data;
    const result = yield call(authorize, data, VERIFY_USER_FOR_SIGNUP_REQUEST, request.mock);
    if (result.status === errorsDictionary.USER_ALREADY_REGISTERED) {
      // verification failed: user exists in DB, we should log them in. Result contains user data, for avoiding calling it again
      yield put({ type: VERIFY_USER_FOR_SIGNUP_REQUEST, verified: false, loggedState: true, user: result.user });
    } else if (result.status === SUCCESS_STATUS) {
      // verification successful: user doesn't exist in DB. We already logged them in in Firebase auth, need to store data.
      yield put({ type: VERIFY_USER_FOR_SIGNUP_REQUEST, verified: true, user: result.user });
    }
  }
}

/**
 * Request an email to recover password
 */
export function* recoverPasswordFlow() {
  while (true) {
    const request = yield take(RECOVER_PASSWORD_REQUEST);
    const data = request.data;
    const result = yield call(authorize, data, RECOVER_PASSWORD_REQUEST, request.mock);
    if (result) {
      yield put({ type: SET_RESPONSE, response: { origin: 'auth', type: RECOVER_PASSWORD_REQUEST, ...result } });
    }
  }
}

/**
 * Verify if user's request to reset password is valid
 */
export function* verifyResetPasswordRequestFlow() {
  while (true) {
    const request = yield take(VERIFY_RESET_PASSWORD_REQUEST);
    const data = request.data;
    const result = yield call(authorize, data, VERIFY_RESET_PASSWORD_REQUEST, request.mock);
    if (result && result.status === SUCCESS_STATUS) {
      // verification successful: link is real and still valid
      yield put({ type: VERIFY_RESET_PASSWORD_REQUEST, verified: true });
    }
  }
}

/**
 * Handling authorizing calls
 * @param {object} data           User's data
 * @param {string} authType       Needs to be included in requests object, pointing to an auth method
 * @param {string} mock           Indicates if this is a mock call, doesn´t affect sagas just pass it through
 */

export function* authorize(data, authType, mock) {
  //We are sending a request, a chance to show loaders
  yield put({ type: SENDING_REQUEST, sending: true });
  let response;
  const requests = {
    SIGNUP_REQUEST: auth.signup,
    LOGIN_REQUEST: auth.login,
    VERIFY_USER_FOR_SIGNUP_REQUEST: auth.verifyUserForSignup,
    LOGOUT_REQUEST: auth.logout,
    RECOVER_PASSWORD_REQUEST: auth.recoverPassword,
    VERIFY_RESET_PASSWORD_REQUEST: auth.verifyResetPasswordRequest,
  };
  try {
    if (!requests[authType]) {
      console.warn('authType not valid:', authType, requests, requests[authType]);
      throw new Error('authType not valid:', authType);
    }
    response = yield call(requests[authType], data, mock);
    return response;
  } catch (error) {
    yield put({
      type: SET_ERROR,
      error: { origin: 'auth', type: authType, message: (error && error.message) || error },
    });
  } finally {
    yield put({ type: SENDING_REQUEST, sending: false });
  }
}
