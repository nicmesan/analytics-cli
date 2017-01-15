var bookshelf = require('../bookshelf');
var kset = require('../models/kset');

exports.collections = bookshelf.Collection.extend({
    model: kset
});