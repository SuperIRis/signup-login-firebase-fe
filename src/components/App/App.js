import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styles from './App.module.css';
import Signup from '../../userAuth/components/Signup';
import Login from '../../userAuth/components/Login';
import Home from '../home/Home';
import PrivateRoute from '../../router/PrivateRoute';
import GuestRoute from '../../router/GuestRoute';
import HomeGuest from '../HomeGuest';
import ResetPassword from '../ResetPassword';
//import { ApolloProvider } from '@apollo/client';
//import client from '../../models/graphql/apolloClient';
import { setup as middlewareSetup } from '../../middleware/setup';
import RecoverPassword from '../../userAuth/components/RecoverPassword';

//this is for setting the infra provider, like Firebase. Not related to React context provider
middlewareSetup();

const App = () => (
  <Switch>
    <GuestRoute exact path='/' component={HomeGuest} />
    <PrivateRoute exact path='/dashboard' component={Home} redirectTo={'/'} />
    <GuestRoute exact path='/login' component={Login} />
    <Route exact path='/account/reset-password' component={ResetPassword} />
    <GuestRoute exact path='/forgot-password' component={RecoverPassword} />
    <GuestRoute exact path='/signup' component={Signup} />
    <Route exact path='/faq' component={HomeGuest} />
  </Switch>
);

export default App;
