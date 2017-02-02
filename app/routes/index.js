var express = require('express');
var Router = express.Router();

// google API

Router.post('/google-api/save-pages/:clientId', require('./save-pages/save-pages-by-value').saveTopValuePages);
Router.post('/google-api/save-keywords/:clientId', require('./save-keywords/save-keywords-by-page').saveKeywords);
Router.post('/google-api/save-all-keywords/:clientId', require('./get-keywords-all-pages/get_keywords_all_pages').saveAllKeywords);

// Other

Router.post('/apply-product-filter/:clientId', require('./apply-product-filter/apply-product-filter').applyProductFilter);
Router.post('/split-ksets/:clientId', require('./split-ksets/split-ksets').splitKsets);
Router.post('/filter-negative-keywords/:clientId', require('./filter-negative-keywords/filter-negative-keywords').filterNegativeKeywords);

exports = module.exports = Router;