import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutRequest } from '../../actions/userAuthActions';

const Logout = ({ dispatch, data }) => {
  const [loggedUser, setLoggedUser] = useState(true);
  function onLogoutClick() {
    dispatch(logoutRequest());
  }

  if (loggedUser) {
    return (
      <a href='#' onClick={onLogoutClick}>
        Logout
      </a>
    );
  } else {
    return <div>what?</div>;
  }
};

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(Logout);
