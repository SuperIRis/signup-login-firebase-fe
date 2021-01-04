import React from 'react';
import { connect } from 'react-redux';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import { recoverPasswordRequest } from '../../actions/userAuthActions';
import RecoverPasswordForm from './RecoverPasswordForm';
import { RECOVER_PASSWORD_REQUEST } from '../../actions/userAuthConstants';

export const RecoverPassword = ({ dispatch, data }) => {
  const submitForm = (values) => {
    dispatch(recoverPasswordRequest({ email: values.email }));
  };
  const submitted =
    data.response && data.response.type === RECOVER_PASSWORD_REQUEST && data.response.status === SUCCESS_STATUS;
  const serverError =
    data.error && data.error.type === RECOVER_PASSWORD_REQUEST && data.error.message && !mockRequestError
      ? data.error.message
      : null;

  return (
    <section>
      <h1>Help with your password</h1>
      <p>
        Did you forget your password? Please input your email address below. We will send you a link to reset your
        password.
      </p>
      {!submitted ? <RecoverPasswordForm onSubmit={submitForm} serverError={serverError} /> : null}
      {submitted ? <div>Please check your email to reset your password!</div> : null}
    </section>
  );
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(RecoverPassword);
