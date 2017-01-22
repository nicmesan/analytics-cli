'use strict';

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const config = require('./config');
const winston = require('winston');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

const app = express();
const connection = connect();

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/express')(app);
require('./config/routes')(app);
winston.info('Server listening on port: ' + port, {});


function listen () {
  if (app.get('env') === 'test') return;
  app.listen(port);


}

function connect () {


}
