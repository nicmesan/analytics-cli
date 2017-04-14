var express = require('express');
var Router = express.Router();

// google API

Router.post('/google-api/save-pages/:clientId', require('./../controllers/save-pages-by-value').saveTopValuePages);
Router.post('/google-api/save-keywords/:clientId', require('./../controllers/save-keywords-by-page').saveKeywords);
Router.post('/google-api/save-all-keywords/:clientId', require('./../controllers/get_keywords_all_pages').saveAllKeywords);

// Other

Router.post('/apply-product-filter/:clientId', require('./../controllers/apply-product-filter').applyProductFilter);
Router.post('/split-ksets/:clientId', require('./../controllers/split-ksets').splitKsets);
Router.post('/filter-negative-keywords/:clientId', require('./../controllers/filter-negative-keywords').filterNegativeKeywords);
Router.post('/filter-stopwords/:clientId', require('./../controllers/filter-stopwords').filterStopwords);


exports = module.exports = Router;