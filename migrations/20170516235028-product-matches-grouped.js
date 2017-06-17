'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {

    return db.createTable('product_matches_grouped', {
        originalKeywordId: {type: 'int'},
        productMatchVector: {type: 'text'},
        clientId: {type: 'int'},
        keywordValue: {type: 'int'}
    });

};

exports.down = function (db) {

    return db.dropTable('product_matches_grouped');
};

exports._meta = {
    "version": 1
};