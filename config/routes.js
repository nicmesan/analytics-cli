'use strict';

/**
 * Module dependencies.
 */

const pages = require('../app/controllers/page');

/**
 * Expose
 */

module.exports = function (app) {

  app.get('/operate', pages.operate)

  /**
   * Error handling
   */

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

};
