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
    return  db.createTable('kets', {
        id:  { type: 'int', primaryKey: true, autoIncrement: true },
        pageId: { type: 'int'}, //TODO find out how to add constraint to pages table
        content: {type: 'string'}
    });
};

exports.down = function(db) {
    return db.dropTable('kets');
};

exports._meta = {
  "version": 1
};
