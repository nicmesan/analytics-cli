'use strict';

/**
 * Module dependencies.
 */

const pages = require('../app/controllers/page');

/**
 * Expose
 */

module.exports = function (app) {

  app.get('/pages', pages.list);
  app.post('/pages', pages.create);
  app.get('/operate', pages.operate)

  /**
   * Error handling
   */

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

};
