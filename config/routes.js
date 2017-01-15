'use strict';

var PageOps = require('../app/services/page-ops');

/**
 * Module dependencies.
 */

const pages = require('../app/controllers/page');

/**
 * Expose
 */

module.exports = function (app) {

  app.post('/saveKeywords/:clientId', function(req, resp) {
    var data = req.body;
    var clientId = req.params.clientId;
    PageOps.prototype.saveKsetsByPage(data.page, clientId)
  });

  /**
   * Error handling
   */

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

};
