import { firebaseSignup, firebaseRemoveUser } from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import addUser from '../models/graphql/mutations/addUser';
import removeUserMutation from '../models/graphql/mutations/removeUser';
import { SUCCESS_STATUS } from '../models/constants';
import errorDictionary from '../models/errorDictionary';

export function signup(data) {
  if (getProvider() === FIREBASE) {
    return firebaseSignup(data).then((res) => {
      //we don't need password in the database, firebase is handling the auth
      delete data.password;
      return addUser({ ...data, id: res.user.uid })
        .then((res) => {
          res.status = SUCCESS_STATUS;
          return res;
        })
        .catch(function(error) {
          //BE error messages will always have 'Error: ErrorType' prefacing the message. In our case, the message is the error code (key to errorDictionary)
          const errorCode = error.message.substr(error.message.lastIndexOf(' ') + 1);
          if (errorDictionary[errorCode]) {
            throw new Error(errorDictionary[errorCode]);
          } else {
            console.error(error);
            throw new Error(errorDictionary.SERVER_ERROR);
          }
        });
    });
  }
}

export function removeUser() {
  if (getProvider() === FIREBASE) {
    return firebaseRemoveUser().then((res) => {
      return removeUserMutation({ id: res.uid });
    });
  }
}
