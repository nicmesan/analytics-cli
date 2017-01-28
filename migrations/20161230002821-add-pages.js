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
  return  db.createTable('pages', {
      id:  { type: 'int', primaryKey: true, autoIncrement: true },
      pagePath: { type: 'string', unique: true },
      pageValue: {type:'decimal'},
      clientId: {type: 'int'}
  });
};

exports.down = function(db) {
  return db.dropTable('pages');
};

exports._meta = {
  "version": 1
};
