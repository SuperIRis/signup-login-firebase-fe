import React from 'react';
import { connect } from 'react-redux';
import ResetPasswordForm from './ResetPasswordForm';
import { resetPasswordRequest } from '../../actions/actions';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';

export const ResetPassword = ({ dispatch, data }) => {
  const submitForm = (values) => {
    dispatch(resetPasswordRequest({ password: values.password }));
  };
  console.log('Reset password', data);
  if (data.response && data.response.status === SUCCESS_STATUS) {
    return (
      <section>
        <h1>Your password was changed successfuly!</h1>
        <p>Please log in with your new password to access your account.</p>
      </section>
    );
  } else {
    return (
      <section>
        <h1>Pick a new password</h1>
        <ResetPasswordForm onSubmit={submitForm} />
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(ResetPassword);
