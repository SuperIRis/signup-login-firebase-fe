import { SENDING_REQUEST, SET_ERROR, CLEAR_ERROR, SET_RESPONSE } from '../actions/constants';

import {
  SET_AUTH,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  VERIFY_RESET_PASSWORD_REQUEST,
} from '../userAuth/actions/userAuthConstants';

const initialState = {
  loggedState: false,
  sending: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, sending: action.sending };
    case SET_AUTH:
      return { ...state, loggedState: action.loggedState };
    case SET_ERROR:
      return { ...state, error: action.error };
    case CLEAR_ERROR:
      return { ...state, error: {} };
    case VERIFY_USER_FOR_SIGNUP_REQUEST:
      return {
        ...state,
        loginMethod: action.loginMethod,
        verifiedForSignup: action.verified,
        loggedState: action.loggedState,
        user: action.user,
      };
    case VERIFY_RESET_PASSWORD_REQUEST:
      return { ...state, verifiedForResetPassword: action.verified };
    case SET_RESPONSE:
      return { ...state, response: action.response };
    default:
      return state;
  }
}

export default reducer;
