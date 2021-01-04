import { fork } from 'redux-saga/effects';
import { resetPasswordFlow } from './account';
import {
  signupFlow,
  loginFlow,
  logoutFlow,
  verifyUserForSignupFlow,
  recoverPasswordFlow,
  verifyResetPasswordRequestFlow,
} from '../userAuth/sagas/auth';

// Fork all sagas here, so they are listening since the start
export default function* root() {
  //auth
  yield fork(signupFlow);
  yield fork(loginFlow);
  yield fork(logoutFlow);
  yield fork(verifyUserForSignupFlow);
  yield fork(recoverPasswordFlow);
  yield fork(verifyResetPasswordRequestFlow);
  //account
  yield fork(resetPasswordFlow);
}
