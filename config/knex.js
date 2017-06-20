/**
 * Created by javieranselmi on 1/11/17.
 */
var dbConfig = {
    client: 'mysql',
    debug: false,
    connection: {
        host     : 'db',
        user     : 'tarantula',
        password : 'tarantula',
        database : 'tarantula',
        charset   : 'utf8',
    } //TODO ADD to .env
};
module.exports = require('knex')(dbConfig);
