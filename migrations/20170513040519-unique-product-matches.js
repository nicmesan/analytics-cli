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

    return db.createTable('unique_product_matches', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        originalKeywordId: {type: 'int'},
        matchedProducts: {type: 'string'},
        keywordValue: {type: 'int'},
        processStatus: {type: 'string', defaultValue: 'unprocessed'}
    });

};

exports.down = function (db) {

    return db.dropTable('unique_product_matches');
};

exports._meta = {
    "version": 1
};