var express = require('express');
var Router = express.Router();

// google API

Router.post('/google-api/save-pages/:clientId', require('./../controllers/save-pages-by-value').saveTopValuePages);
Router.post('/google-api/save-keywords/:clientId', require('./../controllers/save-keywords-by-page').saveKeySets);
Router.post('/google-api/save-all-keywords/:clientId', require('./../controllers/get-keywords-all-pages').saveAllKeySets);

// Other

Router.post('/apply-business-filter/:clientId', require('./../controllers/filter-business').applyBusinessFilter);
Router.post('/apply-product-filter/:clientId', require('./../controllers/apply-product-filter').applyProductFilter);
Router.post('/split-ksets/:clientId', require('./../controllers/split-ksets').splitKsets);
Router.post('/filter-negative-keywords/:clientId', require('./../controllers/filter-negative-keywords').filterNegativeKeySets);
Router.post('/filter-stopwords/:clientId', require('./../controllers/filter-stopwords').filterStopwords);


exports = module.exports = Router;