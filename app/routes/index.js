var express = require('express');
var Router = express.Router();


//Router.get('/test', require('./test').test);
Router.post('/save-pages/:clientId', require('./save_pages/savePagesByValue').saveTopValuePages);
Router.post('/save-keywords/:clientId', require('./save_keywords/saveKeywordsByPage').saveKeywords);
Router.post('/apply-product-filter/:clientId', require('./apply_product_filter/applyProductFilter').applyProductFilter);
Router.post('/split-ksets/:clientId', require('./split_ksets/split-ksets').splitKsets);
Router.post('/save-all-keywords/:clientId', require('./get_keywords_all_pages/get_keywords_all_pages').saveAllKeywords);

exports = module.exports = Router;