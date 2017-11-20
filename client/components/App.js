import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { render } from 'react-dom';
import axios from 'axios';

import Login from './Login';
import Search from './Search'
import Logout from './Logout';

export default class Main extends Component{

  render(){

    return(

      <div className="main">

        <div className="top">

          <div className="titlecontainer">
            <h1>Spotify Web API laarnio search engine</h1>
          </div>

        </div>

        <div className="mid">
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/search" component={Search} />
            <Route path="/logout" component={Logout}/>      
          </Switch>
        </div>
        
        <div className="page-content">

        </div>

      </div>
    );
  }
}
