import React, { Component } from 'react';

export default class Login extends Component {
  
  render() {

    return (
      <div className="login-container">
        <p> Please log in with Spotify </p>
        <a className="login-button" href="/login"> Login </a>
      </div>
    );
  }
}
  