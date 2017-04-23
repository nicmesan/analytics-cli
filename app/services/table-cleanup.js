var knex = require("../../config/knex.js");
var Promise = require('bluebird');
var _ = require('lodash');

function deleteAllRecordsFromTable (tableName, clientId) {
    return knex(tableName).where('clientId', clientId).del();
}

module.exports = function(clientId) {
    var tables = [
        'pages',
        'ksets',
        'product_filtered_ksets',
        'business_filtered_ksets',
        'target_ksets'];

    return Promise.all(tables.map(function(tableName) {
        return deleteAllRecordsFromTable(tableName, clientId);
    }))
}