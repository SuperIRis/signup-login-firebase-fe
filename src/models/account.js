import { resetPassword as middlewareResetPassword } from '../middleware/account';

const account = {
  resetPassword(data) {
    return middlewareResetPassword(data);
  },
};

export default account;
