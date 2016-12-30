var dbConfig = {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'javieranselmi',
    password : 'zapata12',
    database : 'analytics'
  }
};
var knex = require('knex')(dbConfig);
module.exports = require('bookshelf')(knex);