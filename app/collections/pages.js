var bookshelf = require('../bookshelf');
var Page = require('../models/page');

exports.collection = bookshelf.Collection.extend({
    model: Page
});