'use strict';

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const config = require('./config');
const winston = require('winston');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

const app = express();
const Routes = require('./app/routes');

// // Bootstrap models
// fs.readdirSync(models)
//   .filter(file => ~file.indexOf('.js'))
//   .forEach(file => require(join(models, file)));

// Bootstrap routes

app.use(bodyParser.json({ type: 'application/json' }));
app.use(Routes);
app.listen(3000, function () {
    winston.info('Server listening on port: ' + port, {});
});