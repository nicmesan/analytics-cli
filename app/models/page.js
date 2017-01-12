var bookshelf = require('../bookshelf');
var Kset = require('./kset');

var Page = bookshelf.Model.extend({
    tableName: 'pages',
    ksets: function() {
        return this.hasMany(Kset);
    }
});

module.exports = Page;