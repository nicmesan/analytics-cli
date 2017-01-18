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
    return  db.createTable('tokens', {
        id:  { type: 'int', primaryKey: true, autoIncrement: true },
        tokenLabel: {type: 'string'},
        token: {type: 'string'},
        description: { type: 'string'},
        clientId: { type: 'int'} //TODO: Put a foreign key to users
    });
};

exports.down = function(db) {
    return db.dropTable('tokens');
};

exports._meta = {
  "version": 1
};
