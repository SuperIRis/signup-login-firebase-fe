import {
  firebaseSignup,
  firebaseRemoveUser,
  firebaseLoginWithSM,
  firebaseLogin,
  firebaseLogout,
  firebaseRecoverPassword,
} from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import addUser from '../models/graphql/mutations/addUser';
import logoutUser from '../models/graphql/mutations/logoutUser';
import removeUserMutation from '../models/graphql/mutations/removeUser';
import { SOCIAL_AUTH_FACEBOOK, CUSTOM_AUTH } from '../models/constants';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import { errorsDictionary } from '@mokuroku/mokuroku-commons/dictionaries/errors';
import { errorsMessagesDictionary } from '@mokuroku/mokuroku-commons/dictionaries/errors';
import getUser from '../models/graphql/queries/getUser';
import firebase from 'firebase/app';
import { setJWTToken } from '../models/graphql/apolloClient';

function loginWithUserAndPassword(data) {
  return firebaseLogin(data).then((res) => {
    return firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(function(idToken) {
        //setting the JWT token into our Apollo Client middleware so it is included as header
        setJWTToken(idToken);
        return getUser(res.user.uid)
          .then((resUser) => {
            //user is already registered in the site, and has authenticated, let's log them in
            return { status: SUCCESS_STATUS, user: resUser.data.user };
          })
          .catch((error) => {
            if (error.message.includes('USER_UNKNOWN')) {
              throw new Error(errorsMessagesDictionary.USER_UNKNOWN);
            } else {
              throw new Error(error);
            }
          });
      });
  });
}

function loginWithSM(data) {
  return firebaseLoginWithSM(data).then((res) => {
    return firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(function(idToken) {
        //setting the JWT token into our Apollo Client middleware so it is included as header
        setJWTToken(idToken);
        return getUser(res.user.uid)
          .then((resUser) => {
            //user is already registered in the site, and has authenticated with FB, let's log them in
            return { status: SUCCESS_STATUS, user: resUser.data.user };
          })
          .catch((error) => {
            if (error.message.includes('USER_UNKNOWN')) {
              throw new Error(errorsMessagesDictionary.USER_UNKNOWN);
            } else {
              throw new Error(error);
            }
          });
      });
  });
}

function signupWithUserAndPassword(data) {
  return firebaseSignup(data).then((res) => {
    return firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(function(idToken) {
        //setting the JWT token into our Apollo Client middleware so it is included as header
        setJWTToken(idToken);
        return storeUserInDB(data);
      });
  });
}

function signupWithFacebook(data) {
  //as the user was "verified" before, we already signed in with facebook. We need the idToken only.
  return firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(function(idToken) {
      //setting the JWT token into our Apollo Client middleware so it is included as header
      setJWTToken(idToken);
      return storeUserInDB(data);
    });
}

function storeUserInDB(data) {
  const birthDate = `${data.birthDateYYYY}-${('0' + data.birthDateMM).slice(-2)}-${('0' + data.birthDateDD).slice(-2)}`;
  //let´s just send exactly the data we need (for example, omitting password)
  const { email, fullName, username, country, socialId } = data;
  const userData = { email, fullName, username, country, socialId, birthDate };
  return addUser(userData)
    .then((res) => {
      res.status = SUCCESS_STATUS;
      return res;
    })
    .catch(function(error) {
      //If there is an error while saving the user's data, then authentication is invalid as well
      firebaseRemoveUser();
      //BE error messages will always have 'Error: ErrorType' prefacing the message. In our case, the message is the error code (key to errorsMessagesDictionary)
      const errorCode = error.message.substr(error.message.lastIndexOf(' ') + 1);
      if (errorsMessagesDictionary[errorCode]) {
        throw new Error(errorsMessagesDictionary[errorCode]);
      } else {
        console.error(error);
        throw new Error(errorsMessagesDictionary.SERVER_ERROR);
      }
    });
}

export function signup(data) {
  if (getProvider() === FIREBASE) {
    if (data.signupMethod === CUSTOM_AUTH) {
      return signupWithUserAndPassword(data);
    } else if (data.signupMethod === SOCIAL_AUTH_FACEBOOK) {
      return signupWithFacebook(data);
    }
  }
}

export function login(data) {
  if (getProvider() === FIREBASE) {
    if (data.loginMethod === CUSTOM_AUTH) {
      return loginWithUserAndPassword(data);
    } else if (data.loginMethod === SOCIAL_AUTH_FACEBOOK) {
      return loginWithSM(data);
    } else {
      console.error('Login method not supported');
    }
  }
}

export function logout() {
  if (getProvider() === FIREBASE) {
    return firebaseLogout().then((res) => {
      return logoutUser().then((res) => {
        //res.status = SUCCESS_STATUS;
        return res;
      });
    });
  }
}

export function verifyUserForSignup(data) {
  //this is right now only being used for verifying if the user is registered previously with facebook.
  if (getProvider() === FIREBASE) {
    return firebaseLoginWithSM(data).then((res) => {
      // this will return a success if the user is new (verified for signup)
      // return an error in case the user is already registered
      const relevantUserData = {
        id: res.user.uid,
        socialId: res.additionalUserInfo.profile.id,
        providerId: res.additionalUserInfo.providerId,
      };
      if (!res.additionalUserInfo.isNewUser) {
        // user could have reached this point and left. Then come back another day.
        // In this case, isNewUser would be false, but the user would not be in the DB.
        // We should check the DB as well to be sure the user has completed register before.
        // If he/she hasn't, they should complete it.
        // If he/she has, we can assume they are logging in with facebook and redirect them to dashboard already.
        return getUser(res.user.uid)
          .then((res) => {
            //user is already registered in the site, and has authenticated with FB, let's log them in
            return { user: res.data.user, status: errorsDictionary.USER_ALREADY_REGISTERED };
          })
          .catch((error) => {
            if (error.message.includes('USER_UNKNOWN')) {
              //user  verified, they don't exist in our DB
              return { status: SUCCESS_STATUS, user: relevantUserData };
            } else {
              return Promise.reject(error);
            }
          });
      } else {
        // this is the first time this FB user auths with Firebase, no need to query DB
        return { status: SUCCESS_STATUS, user: relevantUserData };
      }
    });
  }
}

export function removeUser() {
  if (getProvider() === FIREBASE) {
    //we need to remove the user from DB before the firebase one. Only authenticated current user can be removed
    return removeUserMutation({ id: firebase.auth().currentUser.uid }).then(() => {
      return firebaseRemoveUser();
    });
  }
}

export function recoverPassword(data) {
  if (getProvider() === FIREBASE) {
    return firebaseRecoverPassword(data)
      .then((data) => {
        console.log('success on recovering!', data);
        return { status: SUCCESS_STATUS };
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found') {
          throw new Error(errorsMessagesDictionary.USER_UNKNOWN);
        } else {
          return err;
        }
      });
  }
}
