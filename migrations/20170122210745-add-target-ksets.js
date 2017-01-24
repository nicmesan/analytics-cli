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
    return  db.createTable('target_ksets', {
        id:  { type: 'int', primaryKey: true, autoIncrement: true },
        keys: { type: 'string'},
        target_url: { type: 'string'},
    });
};

exports.down = function(db) {
    return db.dropTable('target_ksets');
};

exports._meta = {
  "version": 1
};
