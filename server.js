'use strict';

require('dotenv').config();

let join = require('path').join;
let express = require('express');
let winston = require('winston');
let requestLogger = require('./app/middlewares/request-logger');
let cors = require('./app/middlewares/cors');
let bodyParser = require('body-parser');
let errorHandler = require('./app/middlewares/error-handler');
let setCredentials = require('./app/middlewares/set-credentials');
let clientContext = require('./app/middlewares/client-context');
let Routes = require('./app/routes');

const port = process.env.PORT || 8080;
const app = express();

winston.configure({
    transports: [
      new winston.transports.File({
        json: true,
        filename:'/dev/stdout'
      })
    ],
    exitOnError: false
});


app.use(requestLogger);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors);
app.use('/save-client/:clientKey', require('./app/controllers/save-client'));
app.use(clientContext);
app.use('/google-api/*', setCredentials);
app.use(Routes);
app.use(errorHandler);

app.listen(port, function () {
    winston.info('Server listening on port: ' + port, {});
});