var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');

//Private



//Public
module.exports = {
    filterProducts: function (clientId) {
        return knex.raw('INSERT INTO white_ksets (`keys`,pageId)' +
            ' (SELECT REPLACE(`keys`, \' \', \'-\'), pageId ' +
            'FROM ksets WHERE `keys` IN ' +
            '(SELECT description FROM products))');
    }
};
