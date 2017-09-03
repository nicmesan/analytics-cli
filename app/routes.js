var express = require('express');
var Router = express.Router();
Router.post('/google-api/save-pages-and-keywords/', require('./controllers/save-pages-and-keywords'));

exports = module.exports = Router;