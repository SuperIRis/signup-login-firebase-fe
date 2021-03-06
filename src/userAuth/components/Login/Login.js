import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { loginRequest } from '../../actions/userAuthActions';
import LoginForm from './LoginForm';
import FacebookAuth from '../FacebookAuth';
import { SOCIAL_AUTH_FACEBOOK, CUSTOM_AUTH } from '../../../models/constants';
import { LOGIN_REQUEST } from '../../actions/userAuthConstants';

//to prefill form
const testData = process.env.NODE_ENV === 'development' && true; // change to false when testing without data
//to make a mock request to the API that returns success and mock data
const mockRequestSuccess = 'success';
const mockRequestError = '';

export const Login = ({ dispatch, data }) => {
  const prefilledData = {
    email: testData ? 'iris@iris.com' : '',
    password: testData ? 'Admin123' : '',
  };
  const serverError =
    data.error && data.error.type === LOGIN_REQUEST && data.error.message && !mockRequestError
      ? data.error.message
      : null;
  const [loginMethod, setLoginMethod] = useState(CUSTOM_AUTH); //custom or FB
  const sending = data.sending && loginMethod === CUSTOM_AUTH;
  const sendingFB = data.sending && loginMethod === SOCIAL_AUTH_FACEBOOK;
  const submitForm = (values) => {
    //dispatch(signupRequest({ ...data.user, ...values, signupMethod }, mockRequestSuccess));
    dispatch(loginRequest({ ...values, loginMethod: CUSTOM_AUTH }, mockRequestSuccess));
  };

  const onFacebookAuthorized = (facebookData) => {
    setLoginMethod(SOCIAL_AUTH_FACEBOOK);
    dispatch(loginRequest({ loginMethod: SOCIAL_AUTH_FACEBOOK, ...facebookData }, mockRequestSuccess));
  };

  if (data.loggedState) {
    return <Redirect to={{ pathname: '/dashboard' }} />;
  } else {
    return (
      <section>
        <h1>Login</h1>
        <LoginForm onSubmit={submitForm} defaultData={prefilledData} serverError={serverError} loading={sending} />
        <div>
          <Link to='/forgot-password'>Did you forget your password?</Link>
        </div>
        <p> or </p>
        <FacebookAuth onAuthorized={onFacebookAuthorized} loading={sendingFB}>
          Login with Facebook
        </FacebookAuth>
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(Login);
