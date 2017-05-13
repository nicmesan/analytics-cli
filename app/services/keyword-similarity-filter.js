let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let proxyConsumption = require('./proxy-consumption');

//Private

module.exports = function (clientId) {
    return Promise.resolve(true);
};
