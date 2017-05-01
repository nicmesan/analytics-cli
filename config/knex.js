/**
 * Created by javieranselmi on 1/11/17.
 */
var dbConfig = {
    client: 'mysql',
    connection: {
        host     : 'tarantuladb.cluster-cmcsvwubgzig.us-east-1.rds.amazonaws.com',
        user     : 'tarantula',
        password : 'tarantula',
        database : 'tarantula',
    } //TODO ADD to .env
};
module.exports = require('knex')(dbConfig);