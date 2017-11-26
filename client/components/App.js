import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { render } from 'react-dom';
import axios from 'axios';
import 'foundation-sites';
import $ from 'jquery'; //need jquery for foundation

import Login from './Login';
import Search from './Search'
import Logout from './Logout';

//Main component in which all other visible components are rendered. Serves basically as a router
export default class Main extends Component{

  componentDidMount() {

      $(document).foundation();

  }

  render(){

    return(
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/search" component={Search}/>
        <Route path="/logout" component={Logout}/>
      </Switch>
    );
  }
}
