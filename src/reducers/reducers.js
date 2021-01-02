import {
  SENDING_REQUEST,
  SET_AUTH,
  SET_ERROR,
  CLEAR_ERROR,
  VERIFY_USER_FOR_SIGNUP_REQUEST,
  SET_RESPONSE,
} from '../actions/constants';

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
      return { ...state, verifiedForSignup: action.verified, loggedState: action.loggedState, user: action.user };
    case SET_RESPONSE:
      return { ...state, response: action.response };
    default:
      return state;
  }
}

export default reducer;
