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
    return db.createTable('keywords_products_relevance', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        postTitle: {type: 'string'},
        score: {type: 'decimal'},
        originalKeywordId: {type: 'int'},
    })
};

exports.down = function(db) {
  return db.dropTable('keywords_products_relevance');
};

exports._meta = {
  "version": 1
};
