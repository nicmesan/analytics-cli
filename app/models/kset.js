var bookshelf = require('../bookshelf');

var Kset = bookshelf.Model.extend({
    tableName: 'ksets',
});


module.exports = Kset;