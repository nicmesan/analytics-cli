/**
 * Created by javieranselmi on 1/11/17.
 */
var dbConfig = {
    client: 'mysql',
    connection: {
        host     : 'db',
        user     : 'tarantula',
        password : 'tarantula',
        database : 'tarantula'
    }
};
module.exports = require('knex')(dbConfig);