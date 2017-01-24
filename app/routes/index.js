var express = require('express');
var Router = express.Router();



Router.post('/save-pages/:clientId', require('./save_pages/savePagesByValue').saveTopValuePages);
Router.post('/save-keywords/:clientId', require('./save_keywords/saveKeywordsByPage').saveKeywordsByPage);
Router.post('/apply-product-filter/:clientId', require('./apply_product_filter/applyProductFilter').applyProductFilter);

exports = module.exports = Router;