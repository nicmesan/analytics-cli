/**
 * Created by javieranselmi on 1/11/17.
 */
var dbConfig = {
    client: 'mysql',
    debug: false,
    connection: {
        host     : 'tarantula.cmcsvwubgzig.us-east-1.rds.amazonaws.com',
        user     : 'tarantula',
        password : 'tarantula',
        database : 'tarantula',
        charset   : 'utf8',
    } //TODO ADD to .env
};
module.exports = require('knex')(dbConfig);
