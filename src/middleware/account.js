import { firebaseResetPassword } from './firebase/firebaseAccount';

export function resetPassword(data) {
  return firebaseResetPassword(data.token, data.password).then(() => {
    return { status: 'success' };
  });
  //return Promise.resolve({ status: 'success' });
}
