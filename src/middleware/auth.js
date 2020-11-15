import { firebaseSignup, firebaseRemoveUser } from './firebase/firebaseAuth';
import { FIREBASE } from './firebase/firebaseConstants';
import { getProvider } from './provider';
import addUser from '../models/graphql/mutations/addUser';
import removeUserMutation from '../models/graphql/mutations/removeUser';
import { SUCCESS_STATUS } from '../models/constants';

export function signup(data) {
  if (getProvider() === FIREBASE) {
    return firebaseSignup(data).then((res) => {
      return addUser({ ...data, id: res.user.uid }).then((res) => {
        res.status = SUCCESS_STATUS;
        return res;
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
