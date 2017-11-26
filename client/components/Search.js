import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { render } from 'react-dom';
import axios from 'axios';

import Logout from './Logout';

function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return (minutes < 60 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//gets an array of images.
const checkImageUrl = (arr) => {
  if(arr[0]) {
    //console.log('returning url');
    return arr[0].url;
  }
  else{ 
    //console.log('returning default');
    return '/default.png';
  }
}

const getPlaylistFollowers = (userid, playlistid) => {
  let followers = 0;
  axios.get(`/playlist/${userid}/${playlistid}`)
    .then(function(response){
      //console.log(response.data.followers.total);
      followers = response.data.followers.total
    })
    .catch(function(error){
      console.log(error);
    });
  return followers;
}


//TODO: check that user is authed. As it is search is available via url
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
                  authedUser: '',
                  queryType: 'all', //for now we'll go with only searching all types
                  queryResult: {},
                  albums: [],
                  artists: [],
                  tracks: [],
                  playlists: [],
                  resultsToShow: 5,
                };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
    this.handleResultNumberChange = this.handleResultNumberChange.bind(this);
  }

  componentDidMount() {
    var self = this;
    axios.get('/me')
      .then(function(response) {
        self.setState({authedUser: response.data.id});
        //console.log(self.state.authedUser);
      })
      .catch(function(error){
        console.log(error);
      });
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleQueryTypeChange(event) {
    this.setState({queryType: event.target.value});
  }

  handleResultNumberChange(event) {
    this.setState({resultsToShow: this.state.resultsToShow + 5});
  }



  //${this.state.queryType}
  handleSubmit(event) {

    var self = this;
    axios.get(`/search/${this.state.queryType}/${this.state.name}`)
      .then(function (response) {
        self.setState({queryResult: response.data});

        self.setState({albums: response.data.albums.items});
        self.setState({artists: response.data.artists.items});
        self.setState({tracks: response.data.tracks.items});
        self.setState({playlists: response.data.playlists.items});

        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
  }

  renderArtistContainer() {
    let index = 8;
    let artists = this.state.artists.slice(0,index);


    return <div className="grid-x"> {artists.map( function(artists){  return <div className="small-3 cell" key={artists.id}> 
                                                                          <ul>
                                                                          <li><img src={checkImageUrl(artists.images)} height="150" width="150"/></li>
                                                                          <li>{artists.name}</li>
                                                                          </ul>
                                                                         </div> } 
      )} </div>;
  }

  renderTrackContainer() {
    
    let index = 5; //show 5 tracks at a time
    let tracks = this.state.tracks.slice(0, index);

    return <div> <ul> {tracks.map( function(tracks){ return <div className="track-box" key={tracks.id}>
                                                            <li> {tracks.name} </li>
                                                            <li className="inline"> {tracks.artists[0].name}, </li>
                                                            <li className="inline"> {tracks.album.name} </li>
                                                            <li className="inline" id="duration"> {millisToMinutesAndSeconds(tracks.duration_ms)} </li>
                                                            </div>
  })} </ul> 
    
  </div>;


  }
  //<button onClick={ function(){ index = index + 5;} }> more... </button>

  renderAlbumContainer() {
    let index = 4;
    let albums = this.state.albums.slice(0,index);

    return <div className="grid-x"> {albums.map( function(albums){  return <div className="small-3 cell" key={albums.id}> 
                                                                          <ul>
                                                                          <li><img src={checkImageUrl(albums.images)} height="150" width="150"/></li>
                                                                          <li>{albums.name}</li>
                                                                          <li className="inline">{albums.artists[0].name}</li>
                                                                          </ul>
                                                                         </div> } 
      )} </div>;
  }

  renderPlaylistsContainer() {
      let index = 4;
      let playlists = this.state.playlists.slice(0,index);

      return <div className="grid-x"> {playlists.map( function(playlists){  return <div className="small-3 cell" key={playlists.id}> 
                                                                            <ul>
                                                                            <li> <img src={checkImageUrl(playlists.images)} height="150" width="150"/> </li>
                                                                            <li> {playlists.name} </li>
                                                                            <li> {getPlaylistFollowers(playlists.owner.id, playlists.id)} </li>
                                                                            </ul>
                                                                           </div> } 
        )} </div>;
    }
  



  render() {

    let artists = this.state.artists;
    let albums = this.state.albums;
    let tracks = this.state.tracks;
    let playlists = this.state.playlists;
  
    return (
      <div className="search">

        <div className="top-bar">

          <div className="top-bar-left">
            <ul className="menu">
              <li className="search-bar"><input type="text" value={this.state.name} onChange={this.handleNameChange} placeholder="Search music..."/></li>
              <li className="search-button"><button type="button" onClick={this.handleSubmit} className="button">&#x1F50D;</button></li>
            </ul>
          </div>

          <div className="top-bar-right">
            <ul className="menu">
              <div className="inlinediv">
                <li id="authed-user">{this.state.authedUser}</li>
                <li><Logout/></li>
              </div>
            </ul>
          </div>

        </div>

        <div>
          <ul className="tabs" data-tabs id="example-tabs">
            <li className="tabs-title is-active"><a href="#panel1" aria-selected="true">ALL</a></li>
            <li className="tabs-title"><a className="panel-link" href="#panel2">ARTISTS</a></li>
            <li className="tabs-title"><a className="panel-link" href="#panel3">TRACKS</a></li>
            <li className="tabs-title"><a className="panel-link" href="#panel4">ALBUMS</a></li>
            <li className="tabs-title"><a className="panel-link" href="#panel5">PLAYLISTS</a></li>
          </ul>

          <div className="tabs-content" data-tabs-content="example-tabs">
            <div className="tabs-panel is-active" id="panel1">
            
              <div className="brighttab">
                <p>ARTISTS</p>
                {this.renderArtistContainer()}
              </div>
              <div className="darktab">
                <p>TRACKS</p>
                {this.renderTrackContainer()}
              </div>
              <div className="brighttab">
                <p>ALBUMS</p>
                {this.renderAlbumContainer()}
              </div>
              <div className="darktab">
                <p>PLAYLISTS</p>
                {this.renderPlaylistsContainer()}
              </div>

            </div>
            <div className="tabs-panel" id="panel2">
              <div className="singletab">
                <p>ARTISTS</p>
                {this.renderArtistContainer()}
              </div>
            </div>
            <div className="tabs-panel" id="panel3">
              <div className="singletab">
                <p>TRACKS</p>
                {this.renderTrackContainer()}
              </div>
            </div>
            <div className="tabs-panel" id="panel4">
              <div className="singletab">
                <p>ALBUMS</p>
                {this.renderAlbumContainer()}
              </div>
            </div>
            <div className="tabs-panel" id="panel5">
              <div className="singletab">
                <p>PLAYLISTS</p>
                {this.renderPlaylistsContainer()}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

  //              <ul> {data.map( function(data){  return <li key={data.id}> {data.name} </li> } )} </ul>
