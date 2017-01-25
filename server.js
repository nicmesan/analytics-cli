'use strict';

require('dotenv').config();

const join = require('path').join;
const express = require('express');
const winston = require('winston');
const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
var errorHandler = require('./app/middlewares/error-handler');

const app = express();
const Routes = require('./app/routes');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(Routes);
app.use(errorHandler)
app.listen(3000, function () {
    winston.info('Server listening on port: ' + port, {});
});