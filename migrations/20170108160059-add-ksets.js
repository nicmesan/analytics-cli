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
    return  db.createTable('ksets', {
        id:  { type: 'int', primaryKey: true, autoIncrement: true },
        keys: {type: 'string'},
        pathName: { type: 'int'},
        clicks: {type: 'int'},
        impressions:  {type: 'int'},
        ctr: { type: 'decimal'},
        position: { type: 'decimal'},
        pageId : {type: 'int'}

    }).then(function() {
        db.addForeignKey(
            'ksets',
            'pages',
            'FK_ksets_pages',
            {'pageId': 'id'},
            {
                onDelete: 'CASCADE', //Si borro una page, se borran sus ksets.
                onUpdate: 'RESTRICT' //Si intento updatear el ID de una page con ksets, hay error.
            });

    });
};

exports.down = function(db) {
    return db.dropTable('ksets');
};

exports._meta = {
  "version": 1
};
