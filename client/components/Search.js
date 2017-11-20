import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { render } from 'react-dom';
import axios from 'axios';


//TODO: check that user is authed. As it is search is available via url
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
                  queryType: 'track',
                  queryResult: [] };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleQueryTypeChange(event) {
    this.setState({queryType: event.target.value});
  }


  handleSubmit(event) {

    //TODO: parameter for desired number of items, default is 20,
    //Display more data in results
    var self = this;
    axios.get(`/search/${this.state.queryType}/${this.state.name}`)
      .then(function (response) {
        self.setState({queryResult: response.data.items});

      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
  }

  render() {

    var data = this.state.queryResult;
    return (
      <div className="search">
        <form onSubmit={this.handleSubmit}>     
          
          <label className="searchTypeSelector">
            Search for:
            <select value={this.state.queryType} onChange={this.handleQueryTypeChange}>
              <option value="track">Track</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
              <option value="playlist">Playlist</option>
            </select>
          </label>

          <label className="searchInput">
            Name:
            <input type="text" value={this.state.name} onChange={this.handleNameChange} />
          </label>
          <input type="submit" value="Search" />
        </form>

        <br/>
        

        <div className="searchResults">
          <ul> {data.map( function(data){ return <li key={data.id}> {data.name} </li> } )} </ul>
        </div>

        <a className="logout" href="/logout"> Log out </a>

      </div>
    );
  }
}