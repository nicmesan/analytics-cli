var express = require('express');
var Router = express.Router();



Router.post('/save-pages/:clientId', require('./save_pages/savePagesByValue').saveTopValuePages);
Router.post('/save-keywords/:clientId', require('./save_keywords/saveKeywordsByPage').saveKeywordsByPage);

exports = module.exports = Router;