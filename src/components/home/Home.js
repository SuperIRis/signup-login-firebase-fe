import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from './react.svg';
import Logout from '../../userAuth/components/Logout';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedState: false, counter: 0 };
  }

  render() {
    return (
      <>
        <div>
          <img src={logo} className='Home-logo' alt='logo' />
          <h2>Welcome to MyList test</h2>
        </div>
        <div>You are ready!</div>
        <Logout />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state,
  };
}

export default connect(mapStateToProps)(Home);
