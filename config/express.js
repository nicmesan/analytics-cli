
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser')

var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function (app) {
   app.use(bodyParser.json({ type: 'application/json' }));
};
