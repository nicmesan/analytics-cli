
/**
 * Module dependencies.
 */

var express = require('express');
var config = require('./');
var pkg = require('../package.json');
var bodyParser = require('body-parser')

var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function (app) {
   app.use(bodyParser.json({ type: 'application/json' }));
};
