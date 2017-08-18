//let knex = require("../../config/knex.js");
let client = require("../../config/elasticsearch");

module.exports = function insertOrReplace(data, table, constraint) {


    return Promise.all(data, (document) => {
        client.index({
            index: 'tarantula',
            type: 'pages',
            body: document
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
