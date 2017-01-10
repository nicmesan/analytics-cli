var dbConfig = {
  client: 'mysql',
  connection: {
    host     : 'db',
    user     : 'tarantula',
    password : 'tarantula',
    database : 'tarantula'
  }
};
var knex = require('knex')(dbConfig);
module.exports = require('bookshelf')(knex);