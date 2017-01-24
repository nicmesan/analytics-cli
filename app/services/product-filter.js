var knex = require("../../config/knex.js");

//Private
function filterProducts(clientId) {
    return knex.raw('INSERT INTO target_ksets (`keys`, target_url) ' +
        'VALUES (' +
        '(SELECT (`keys`) FROM ksets WHERE `keys` IN (SELECT description FROM products)' +
        '), \'www.placeholder.com/?g=kset\')');
};

//Public
module.exports = {
    filterProducts: filterProducts
};
