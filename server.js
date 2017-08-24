'use strict';

require('dotenv').config();

const join = require('path').join;
const express = require('express');
const winston = require('winston');
const requestLogger = require('./app/middlewares/request-logger');
const cors = require('./app/middlewares/cors');
var bodyParser = require('body-parser');
var errorHandler = require('./app/middlewares/error-handler');
var setCredentials = require('./app/middlewares/set-credentials');
var clientContext = require('./app/middlewares/client-context');


const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

const app = express();
const Routes = require('./app/routes');

let client = require("./config/elasticsearch");





app.use(requestLogger);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors);
app.use('/save-client/:clientKey', require('./app/controllers/save-client'));
app.use(clientContext);
app.use('/google-api/*', setCredentials);

app.use(Routes);
app.use(errorHandler);
app.listen(3000, function () {
    winston.info('Server listening on port: ' + port, {});
});