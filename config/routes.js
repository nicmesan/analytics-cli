'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');

/**
 * Expose
 */

module.exports = function (app) {

  app.get('/', home.index);

  /**
   * Error handling
   */

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

};
