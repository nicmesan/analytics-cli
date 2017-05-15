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

    return db.createTable('product_match_equivalence_classes', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        originalKeywordId: {type: 'int'},
        matchedProducts: {type: 'string'},
        keywordValue: {type: 'int'},
        processStatus: {type: 'string', defaultValue: 'unprocessed'}
    });

};

exports.down = function (db) {

    return db.dropTable('product_match_equivalence_classes');
};

exports._meta = {
    "version": 1
};