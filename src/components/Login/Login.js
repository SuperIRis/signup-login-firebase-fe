import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { loginRequest } from '../../actions/actions';
import LoginForm from './LoginForm';
import FacebookAuth from '../FacebookAuth';
import { SOCIAL_AUTH_FACEBOOK, CUSTOM_AUTH } from '../../models/constants';

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
  const serverError = data.error && data.error.message && !mockRequestError ? data.error.message : null;
  const { sending } = data;
  const submitForm = (values) => {
    //dispatch(signupRequest({ ...data.user, ...values, signupMethod }, mockRequestSuccess));
    dispatch(loginRequest({ ...values, loginMethod: CUSTOM_AUTH }, mockRequestSuccess));
  };

  const onFacebookAuthorized = (facebookData) => {
    dispatch(loginRequest({ loginMethod: SOCIAL_AUTH_FACEBOOK, ...facebookData }, mockRequestSuccess));
  };

  if (data.loggedState) {
    return <Redirect to={{ pathname: '/dashboard' }} />;
  } else {
    return (
      <section>
        <h1>Login</h1>
        <LoginForm onSubmit={submitForm} defaultData={prefilledData} serverError={serverError} loading={sending} />
        <p> or </p>
        <FacebookAuth onAuthorized={onFacebookAuthorized}>Login with Facebook</FacebookAuth>
        <p>Loading:{data.sending}</p>
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
