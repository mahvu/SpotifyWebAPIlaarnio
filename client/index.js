import React, { Component } from 'react';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom'; //using hashrouter over browser router to simplify redirect
                                                                              //from server.js/callback
import ReactDOM, { render } from 'react-dom';
import App from './components/App';

const Root = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);