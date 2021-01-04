import React from 'react';
import { useLocation, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ResetPasswordForm from './ResetPasswordForm';
import { resetPasswordRequest } from '../../actions/actions';
import { verifyResetPasswordRequest } from '../../userAuth/actions/userAuthActions';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import { VERIFY_RESET_PASSWORD_REQUEST } from '../../userAuth/actions/userAuthConstants';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
let dispatched = false;

export const ResetPassword = ({ dispatch, data }) => {
  const query = useQuery();
  const mode = query.get('mode');
  const token = query.get('oobCode');
  const submitForm = (values) => {
    dispatch(resetPasswordRequest({ password: values.password, token }));
  };
  const resetPasswordSuccess = (
    <section>
      <h1>Your password was changed successfuly!</h1>
      <p>Please log in with your new password to access your account.</p>
      <p>
        <Link to='/login'>Go to login</Link>
      </p>
    </section>
  );
  const resetPasswordError = (
    <section>
      <h1>This link has expired</h1>
      <p>
        Please <Link to='/forgot-password'>try resetting your password again.</Link>
      </p>
    </section>
  );
  const loading = <div>Loading...</div>;
  //console.log('Reset password', data);
  //
  if (data.sending) {
    return loading;
  } else if (data.response && data.response.status === SUCCESS_STATUS) {
    return resetPasswordSuccess;
  } else if (data.loggedState) {
    //user is logged in, they want to change their password
    return <ResetPasswordForm onSubmit={submitForm} />;
  } else if (data.error && data.error.type === VERIFY_RESET_PASSWORD_REQUEST) {
    //The verification for the request failed from provider
    return resetPasswordError;
  } else if (data.verifiedForResetPassword) {
    //verification for the request was successful
    return <ResetPasswordForm onSubmit={submitForm} />;
  } else if (mode === 'resetPassword' && token) {
    //user is trying to recover password from email, we need to check if token is
    if (!dispatched) {
      dispatch(verifyResetPasswordRequest({ token }));
      dispatched = true;
    }
    return loading;
  } else {
    //if the user is logged and trying to change their password, then loggedState should be true
    //if the user is coming from email link, both mode and oobCode should exist as queryStrings
    //if none of those is true, this is a fake request, redirect to home
    return <Redirect to='/' />;
  }
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(ResetPassword);
