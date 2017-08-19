//let knex = require("../../config/knex.js");
let client = require("../../config/elasticsearch");

module.exports = function insertOrReplace(data, type) {

    winston.info("starting insert into ES", type);


    return Promise.all(data, (document) => {
        return client.index({
            index: 'tarantula',
            type: type,
            body: document
        }).then((resp) => {
            winston.info("inserted into ES", resp);
            return "ok";
        }).catch((err) => {
            winston.info("error inserting into ES", err);
        });
    });

    /*let insert = knex(table).insert(data);
    let update = '';

    for (let column in data[0]) {
        if (column !== constraint) {
            update +=  `${column}=VALUES(${column}),`
        }
    }

    let formattedUpdate = update.slice(0, -1);

    let query = `${insert.toString()} ON DUPLICATE KEY UPDATE ${formattedUpdate};`;

    return knex.raw(query);*/
};
