import {
  SIGNUP_REQUEST,
  SENDING_REQUEST,
  SET_AUTH,
  LOGIN_REQUEST,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  SET_ERROR,
} from '../actions/constants';
import { SUCCESS_STATUS } from '../models/constants';
import { take, call, put, fork } from 'redux-saga/effects';
import auth from '../models/auth';
import errorDictionary from '../models/errorDictionary';

/**
 * Authorizing user
 * @param {object} data           User's data
 * @param {string} data.username  User's username
 * @param {string} data.password  User's password
 * @param {string} data.email     User's email (only register)
 * @param {string} data.country   User's country (only register)
 * @param {string} data.name      User's name (only register)
 * @param {object} options        Options
 * @param {string} authType       Can be either SIGNUP_REQUEST or LOGIN_REQUEST (default LOGIN_REQUEST)
 */

export function* authorize(data, authType, mock) {
  //We are sending a request, a chance to show loaders
  yield put({ type: SENDING_REQUEST, sending: true });
  let response;
  try {
    if (authType === SIGNUP_REQUEST) {
      response = yield call(auth.signup, data, mock);
    } else if (authType === LOGIN_REQUEST) {
      response = yield call(auth.login, data, mock);
    } else if (authType === VERIFY_USER_FOR_SIGNUP_REQUEST) {
      response = yield call(auth.verifyUserForSignup, data, mock);
    } else {
      throw new Error('authType required');
    }
    return response;
  } catch (error) {
    yield put({ type: SET_ERROR, error });
  } finally {
    yield put({ type: SENDING_REQUEST, sending: false });
  }
}

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
    const data = { ...request.data };
    const success = yield call(authorize, data, SIGNUP_REQUEST, request.mock);
    if (success) {
      yield put({ type: SET_AUTH, loggedState: true });
    }
  }
}

/**
 * Verify if user is registered flow
 */
export function* verifyUserForSignupFlow() {
  while (true) {
    const request = yield take(VERIFY_USER_FOR_SIGNUP_REQUEST);
    const data = { ...request.data };
    const result = yield call(authorize, data, VERIFY_USER_FOR_SIGNUP_REQUEST, request.mock);
    console.log('success-----...----', result);
    if (result.status === errorDictionary.USER_ALREADY_REGISTERED) {
      // verification failed: user exists in DB, we should log them in. Result contains user data, for avoiding calling it again
      yield put({ type: VERIFY_USER_FOR_SIGNUP_REQUEST, verified: false, loggedState: true, user: result.user });
    } else if (result.status === SUCCESS_STATUS) {
      // verification successful: user doesn't exist in DB. We already logged them in in Firebase auth, need to store data.
      yield put({ type: VERIFY_USER_FOR_SIGNUP_REQUEST, verified: true, user: result.user });
    }
  }
}

// Fork all sagas here, so they are listening since the start
export default function* root() {
  yield fork(signupFlow);
  yield fork(loginFlow);
  yield fork(verifyUserForSignupFlow);
  //yield fork(sessionFlow);
}
