/**
 * Created by javieranselmi on 1/11/17.
 */
var knex = require('../../config/knex');

function getToken(tokenKey) {
    return knex.select('token').from('tokens').where('name','=',tokenKey).then(function(res) {
        return res[0].token;
    })
}

var tokenManager = {
    getToken: getToken
}

module.exports = tokenManager;
