var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private



//Public
module.exports = {
    filterProducts: function (clientId) {
        return knex.raw('INSERT INTO target_ksets (`keys`,clientId)' +
            ' (SELECT REPLACE(`keys`, \' \', \'-\'),' + clientId + ' ' +
            'FROM ksets WHERE `keys` IN ' +
            '(SELECT description FROM products))');
    }
};
