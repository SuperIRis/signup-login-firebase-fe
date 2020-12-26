import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signupRequest, verifyUserForSignupRequest } from '../../actions/actions';
import UserInfoForm from '../UserInfoForm';
import FacebookAuth from '../FacebookAuth';
import { SOCIAL_AUTH_FACEBOOK, CUSTOM_AUTH } from '../../models/constants';

//three dev modes:
//to prefill form
const testData = process.env.NODE_ENV === 'development' && true; // change to false when testing without data
//to make a mock request to the API that returns an error
const mockRequestError = '';
//to make a mock request to the API that returns success and mock data
const mockRequestSuccess = '';

export const Signup = ({ dispatch, data }) => {
  const prefilledData = {
    fullName: testData ? 'Dev Iris' : '',
    email: testData ? 'iris@iris.com' : '',
    username: testData ? 'superiris' : '',
    country: testData ? 'Mexico' : '',
    password: testData ? 'Admin123' : '',
    passwordConfirmation: testData ? 'Admin123' : '',
    birthDateDD: testData ? '26' : '',
    birthDateMM: testData ? '8' : '',
    birthDateYYYY: testData ? '1982' : '',
    terms: testData ? true : false,
  };
  const serverError = data.error && data.error.message && !mockRequestError ? data.error.message : null;

  const [formValues, setFormValues] = useState(prefilledData);
  const [signupMethod, setSignupMethod] = useState(CUSTOM_AUTH); //custom or FB

  const submitForm = (values) => {
    dispatch(signupRequest({ ...data.user, ...values, signupMethod }, mockRequestSuccess));
  };

  const onFacebookAuthorized = (facebookData) => {
    //when signing up with Facebook, we need to ensure the user hasn't signed up before
    //so we verify if they are eligible for signup
    //if they are not, means they were already there and we can just redirect them to home (by setting the auth, route handles it)
    dispatch(verifyUserForSignupRequest(facebookData, mockRequestError)); //second parameter can be mock, we want this to fail to be able to test the fb signup without removing the app from our FB account each test
    setSignupMethod(SOCIAL_AUTH_FACEBOOK);
    prefillFields(facebookData.user);
  };

  const prefillFields = (user) => {
    setFormValues({
      ...formValues,
      fullName: user.name,
      email: user.email,
      signupMethod: SOCIAL_AUTH_FACEBOOK,
      socialId: user.id,
    });
  };

  if (!data.loggedState) {
    return (
      <section>
        <h1>Signup</h1>
        <h2>Register with Facebook</h2>
        <FacebookAuth onAuthorized={onFacebookAuthorized} />
        <h2>Register with your email</h2>
        <UserInfoForm onSubmit={submitForm} serverError={serverError} values={formValues} signupMethod={signupMethod} />
      </section>
    );
  } else {
    return <Redirect to={{ pathname: '/dashboard' }} />;
  }
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

//connecting component to the store (https://react-redux.js.org/introduction/basic-tutorial)
export default connect(mapStateToProps)(Signup);
