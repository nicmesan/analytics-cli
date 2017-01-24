var knex = require("../../config/knex.js");

//Private
function filterProducts(clientId) {
    return knex.raw('INSERT INTO target_ksets (`keys`) (SELECT REPLACE(`keys`, \' \', \'-\') FROM ksets WHERE `keys` IN (SELECT description FROM products))');
};

//Public
module.exports = {
    filterProducts: filterProducts
};
