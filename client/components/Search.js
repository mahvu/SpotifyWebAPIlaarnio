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
                  queryResult: [],
                  resultsToShow: 20
                };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
    this.handleResultNumberChange = this.handleResultNumberChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleQueryTypeChange(event) {
    this.setState({queryType: event.target.value});
  }

  handleResultNumberChange(event) {
    this.setState({resultsToShow: event.target.value});
  }


  handleSubmit(event) {

    var self = this;
    axios.get(`/search/${this.state.queryType}/${this.state.name}`)
      .then(function (response) {
        self.setState({queryResult: response.data.items});
        //console.log(self.state.queryResult);
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
  }

  render() {

    var data = this.state.queryResult.slice(0, this.state.resultsToShow);
  
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

          <label className="resultsToShowSelector">
            Show:
            <select value={this.state.resultsToShow} onChange={this.handleResultNumberChange}>
              <option value={1}>1</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

        </form>

        <br/>
        

        <div className="searchResults">
          <ul> {data.map( function(data){  return <li key={data.id}> {data.name} </li> } )} </ul>
        </div>

        {this.state.resultsToShow}

        <a className="logout" href="/logout"> Log out </a>

      </div>
    );
  }
}

/*
{
  for (var i = 0; i < this.state.resultsToShow; i++) {
    return <li key={data[i].id}> {data[i].name} </li>
  }
}

//{data.map( function(data){  return <li key={data.id}> {data.name} </li> } )}

*/