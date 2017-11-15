//dependencies
const express = require('express');
const path = require('path');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

//local dependencies
const requireEnvs = require('./require-envs'); //require secrets as environment vars
requireEnvs();

const generateRandomString = require('./generate-random-string');

const client_id = requireEnvs([CLIENTID]);
console.log(client_id);
const client_secret = requireEnvs([CLIENTSECRET]);
const redirect_uri = requireEnvs([REDIRECTURI]);



const stateKey = 'spotify_auth_state';
const app = express();

//serve static
app.use(express.static(path.join(__dirname, '/public'))
  .use(cookieParser()));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public', 'index.html'))
})

PORT = process.env.PORT || 8080;

app.listen(PORT, function(){
  console.log('Production Express server running at localhost:' + PORT)
})