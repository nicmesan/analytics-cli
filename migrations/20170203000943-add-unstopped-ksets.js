'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return  db.createTable('unstopped_ksets', {
        id:  { type: 'int' },
        keys: {type: 'string'},
        pageId : {type: 'int'}
    });
};

exports.down = function(db) {
    return db.dropTable('unstopped_ksets');
};

exports._meta = {
    "version": 1
};

