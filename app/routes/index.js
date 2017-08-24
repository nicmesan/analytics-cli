var express = require('express');
var Router = express.Router();

// google API

Router.post('/google-api/save-pages/', require('./../controllers/save-pages'));
Router.post('/google-api/save-keywords/', require('./../controllers/save-keywords'));

// Filters

//Router.post('/apply-business-filter/:clientId', require('./../controllers/filter-business').applyBusinessFilter);
//Router.post('/apply-product-filter/:clientId', require('./../controllers/apply-product-filter').applyProductFilter);
//Router.post('/filter-negative-keywords/:clientId', require('./../controllers/filter-negative-keywords').filterNegativeKeywords);
//Router.post('/table-cleanup/:clientId', require('./../controllers/table-cleanup').tableCleanup);
//Router.post('/apply-keyword-similarity-filter/:clientId', require('./../controllers/keyword-similarity-filter').filterSimilarKeywords);


// Widget

//Router.get('/widget/:clientId', require('./../controllers/get-widget').getWidget);

exports = module.exports = Router;