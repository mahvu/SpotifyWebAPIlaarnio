'use strict';

const Spotify = require('spotify-web-api-node'); //https://github.com/thelinmichael/spotify-web-api-node
                                                 //A Node.js wrapper for Spotify's Web API.
const querystring = require('querystring');
const express = require('express');
const router = new express.Router();

const requireEnvs = require('./require-envs'); //require secrets as environment vars
requireEnvs();                                 //iterates over an array of env vars to check if vars are set,
                                               //throws Error('Environment variable not set: ' + varName)

const CLIENT_ID = process.env.CLIENTID;
const CLIENT_SECRET = process.env.CLIENTSECRET;
const REDIRECT_URI = process.env.REDIRECTURI;
const STATE_KEY = 'spotify_auth_state';         
const scopes = ['user-read-private', 'user-read-email'];


// configure spotify
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);


/*
  TODO: response codes, error routing(now we're just routing to root)
*/


router.get('/login', (_, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

//not the most elegant way, but for the purpose of this demo, it works.
router.get('/logout', (_, res) => {
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
  res.redirect('/#/');
});

router.get('/me', (req, res) => { 
  spotifyApi.getMe()
    .then(function(data) {
      res.status(200).json(data.body);
    }, function(err) {
      console.error(err);
    });
});

router.get('/playlist/:userid/:playlistid', (req, res) => {

  const userid = req.params.userid;
  //console.log(userid);
  const playlistid = req.params.playlistid;
  //console.log(playlistid);

  spotifyApi.getPlaylist(userid, playlistid)
    .then(function(data) {
      //console.log(data.body);
      res.status(200).json(data.body);
    }, function(err) {
      console.error(err);
    });

});


//Might be a good idea to have endpoints for each type
router.get('/search/:type/:name', (req, res) => {

  //check type for artist, track, album or playlist
  const type = req.params.type;

  //track name, artist name etc
  const name = req.params.name;

  //redirect according to type
  if(type === 'artist'){
    spotifyApi.searchArtists(name, { limit: 50})
      .then(function(data) {
        res.status(200).json(data.body);
      }, function(err) {
        console.error(err);
      });
  }
  else if(type === 'track'){
    spotifyApi.searchTracks(name, { limit: 50})
      .then(function(data) {
        res.status(200).json(data.body);
      }, function(err) {
        console.error(err);
      });
  }
  else if(type === 'album'){
    spotifyApi.searchAlbums(name, { limit: 50})
      .then(function(data) {
        res.status(200).json(data.body);
      }, function(err) {
        console.error(err);
      });

  }
  else if(type === 'playlist'){
    spotifyApi.searchPlaylists(name, { limit: 50})
      .then(function(data) {
        res.status(200).json(data.body);
      }, function(err) {
        console.error(err);
      });
  }
  else if(type === 'all'){
    spotifyApi.search(name,['artist', 'track', 'album', 'playlist'], { limit: 50})
      .then(function(data) {
        res.status(200).json(data.body);
      }, function(err) {
        console.error(err);
      });
  }
  else{ //default
    res.redirect('/#/');
  }
});


router.get('/callback', (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  //state validation
  if (state === null || state !== storedState) {
    res.redirect('/#');
  // if the state is valid, get the authorization code and pass it on to the client
  } 

  else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
      const { expires_in, access_token, refresh_token } = data.body;

      // Set the access token on the API object
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      //redirect to search
      res.redirect(`/#/search`);
    }).catch(err => {
      res.redirect('/#');
    });
  }
});
   
module.exports = router;
