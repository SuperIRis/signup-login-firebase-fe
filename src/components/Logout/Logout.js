import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutRequest } from '../../actions/actions';

const Logout = ({ dispatch, data }) => {
  const [loggedUser, setLoggedUser] = useState(true);
  console.log(data);
  function onLogoutClick() {
    console.log('logout---');
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
