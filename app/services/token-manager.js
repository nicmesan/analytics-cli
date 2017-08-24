let searchEs = require('../utils/search-es');

function getToken(tokenKey, clientKey) {
    var body = {
        query: {
            match: {
                clientKey: clientKey
            }
        },
    };
    return searchEs(clientKey, 'clients', body).then((clientData))
}




//TODO: implement setToken function
//TODO: relate token to a user/site

var tokenManager = {
    getToken: getToken
}

module.exports = tokenManager;
