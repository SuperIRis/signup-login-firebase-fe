import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styles from './App.module.css';
import Signup from '../Signup';
import Login from '../Login';
import Home from '../home/Home';
import PrivateRoute from '../../router/PrivateRoute';
import GuestRoute from '../../router/GuestRoute';
import HomeGuest from '../HomeGuest';
import { ApolloProvider } from '@apollo/client';
import client from '../../models/apolloClient';
import { setup as middlewareSetup } from '../../middleware/setup';

//this is for setting the infra provider, like Firebase. Not related to React context provider
middlewareSetup();

const App = () => (
  <Switch>
    <GuestRoute exact path='/' component={HomeGuest} />
    <PrivateRoute exact path='/dashboard' component={Home} redirectTo={'/'} />
    <GuestRoute exact path='/login' component={Login} />
    <GuestRoute exact path='/signup' component={Signup} />
    <Route exact path='/faq' component={HomeGuest} />
  </Switch>
);

export default App;
