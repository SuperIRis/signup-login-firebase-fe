import { SIGNUP_REQUEST, LOGIN_REQUEST, LOGOUT_REQUEST, VERIFY_USER_FOR_SIGNUP_REQUEST } from '../actions/constants';
import { setAuthState, sendingRequest, setError } from '../actions/actions';
import sagasRoot from './sagas';
import {
  loginFlow,
  signupFlow,
  logoutFlow,
  verifyUserForSignupFlow,
  recoverPasswordFlow,
  verifyResetPasswordRequestFlow,
  authorize,
} from './auth';
import { resetPasswordFlow } from './account';
import { take, call, put, fork } from 'redux-saga/effects';
import auth from '../models/auth';
describe('Sagas', () => {
  const user = { username: 'superiris', password: 'Admin123' };
  const data = { ...user, loginAttempts: 1 };
  const putLogged = { ...put(setAuthState(true)) };
  const putUnlogged = { ...put(setAuthState(false)) };
  const putVerifiedForSignup = { type: VERIFY_USER_FOR_SIGNUP_REQUEST, verified: true, user };
  const sendRequestTrue = { ...put(sendingRequest(true)) };
  const sendRequestFalse = { ...put(sendingRequest(false)) };
  const sendError = { ...put(setError({ message: 'authType not valid:' })) };
  it('Succesfully go through loginFlow ', () => {
    const gen = loginFlow();
    expect(gen.next().value).toEqual(take('LOGIN_REQUEST'));
    expect(gen.next({ data }).value).toEqual({ ...call(authorize, data, LOGIN_REQUEST, undefined) });
    expect(gen.next(true).value).toEqual(putLogged);
  });
  it('Succesfully go through signupFlow ', () => {
    const gen = signupFlow();
    expect(gen.next().value).toEqual(take('SIGNUP_REQUEST'));
    expect(gen.next({ data: { ...user } }).value).toEqual({
      ...call(authorize, { ...user }, SIGNUP_REQUEST, undefined),
    });
    expect(gen.next(true).value).toEqual(putLogged);
  });
  it('Succesfully go through logoutFlow ', () => {
    const gen = logoutFlow();
    expect(gen.next().value).toEqual(take('LOGOUT_REQUEST'));
    expect(gen.next({}).value).toEqual({
      ...call(authorize, {}, LOGOUT_REQUEST),
    });
    expect(gen.next(true).value).toEqual(putUnlogged);
  });
  it('Succesfully go through verifyUserForSignupFlow', () => {
    const gen = verifyUserForSignupFlow();
    expect(gen.next().value).toEqual(take(VERIFY_USER_FOR_SIGNUP_REQUEST));
    expect(gen.next({}).value).toEqual({
      ...call(authorize, undefined, VERIFY_USER_FOR_SIGNUP_REQUEST, undefined),
    });
  });
  it('Sends LOGIN_REQUEST in authorize for logins ', () => {
    const gen = authorize({}, LOGIN_REQUEST);
    expect(gen.next().value).toEqual(sendRequestTrue);
    expect(gen.next().value).toEqual({ ...call(auth.login, {}, undefined) });
    expect(gen.next().value).toEqual(sendRequestFalse);
  });
  it('Sends SIGNUP_REQUEST in authorize for signups ', () => {
    const gen = authorize({}, SIGNUP_REQUEST);
    expect(gen.next().value).toEqual(sendRequestTrue);
    expect(gen.next().value).toEqual({ ...call(auth.signup, {}, undefined) });
    expect(gen.next().value).toEqual(sendRequestFalse);
  });
  it('Throws an error when authType is not defined', () => {
    const gen = authorize();
    expect(gen.next().value).toEqual(sendRequestTrue);
    expect(gen.next().value.message).toEqual(sendError.message);
    expect(gen.next().value).toEqual(sendRequestFalse);
  });
  it('Root listens to all auth and account sagas', () => {
    const gen = sagasRoot();
    expect(gen.next().value).toEqual(fork(signupFlow));
    expect(gen.next().value).toEqual(fork(loginFlow));
    expect(gen.next().value).toEqual(fork(logoutFlow));
    expect(gen.next().value).toEqual(fork(verifyUserForSignupFlow));
    expect(gen.next().value).toEqual(fork(recoverPasswordFlow));
    expect(gen.next().value).toEqual(fork(verifyResetPasswordRequestFlow));
    expect(gen.next().value).toEqual(fork(resetPasswordFlow));
  });
});
