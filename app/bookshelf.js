var dbConfig = {
  client: 'mysql',
  connection: {
    host     : 'db',
    user     : 'tarantula',
    password : 'tarantula',
    database : 'analytics-cli'
  }
};
var knex = require('knex')(dbConfig);
module.exports = require('bookshelf')(knex);