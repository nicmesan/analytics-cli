var knex = require("../../config/knex.js");

//Private
function filterProducts(clientId) {
    return knex.raw('INSERT INTO target_ksets (`keys`,clientId)' +
        ' (SELECT REPLACE(`keys`, \' \', \'-\'),' + clientId + ' ' +
        'FROM ksets WHERE `keys` IN ' +
        '(SELECT description FROM products))');
};

function filterProducts(clientId) {
    return knex.raw('INSERT INTO target_ksets (`keys`,clientId)' +
        ' (SELECT REPLACE(`keys`, \' \', \'-\'),' + clientId + ' ' +
        'FROM ksets WHERE `keys` IN ' +
        '(SELECT description FROM products))');
};

//Public
module.exports = {
    filterProducts: filterProducts
};
