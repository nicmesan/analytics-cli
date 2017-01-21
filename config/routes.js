'use strict';

var PageOps = require('../app/services/page-ops');

/**
 * Module dependencies.
 */

const pages = require('../app/controllers/page');

/**
 * Expose
 */

// App routes
var Routes = require('../app/routes');

// module.exports = function (app) {
//
//   // app.use(Routes);
//
//   app.post('/save-keywords/:clientId', function(req, resp) {
//     var data = req.body;
//     var clientId = req.params.clientId;
//     PageOps.prototype.saveKsetsByPage(data.pageId, clientId)
//   });
//
//   app.post('/save-pages/:clientId', function(req, resp) {
//       PageOps.prototype.savePagesByValue(req, resp)
//   });
//
//   /**
//    * Error handling
//    */
//
//
//
// };
