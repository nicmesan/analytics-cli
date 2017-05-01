let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let strategies = require('./strategies');

function getClientData (clientId) {
    return knex
        .select('id', 'mainDomain', 'searchDomain', 'searchUrlPrefix', 'searchUrlSuffix', 'strategy', 'separator')
        .from('clients').where('id','=', clientId);
}
function generateFromUrl(kset, clientData) {
    switch(clientData.strategy) {
        case 'REPLACE':
            let options = { separator: clientData.separator };
            return strategies.replaceStrategy(kset, options);
        default:
            return strategies.defaultStrategy(kset);
    }
}

function generateToUrl(kset, clientData) {
    return strategies.replaceStrategy(kset, {
        separator: '-',
        prefix: clientData.searchUrlPrefix,
        suffix: clientData.searchUrlSuffix
    });
}

function generateTargetKsets(ksets, clientData) {
    return _.map(ksets, function(kset) {
        return generateTargetKeyword(kset, clientData)
    });
}

function generateTargetKeyword(keyword, clientData) {
    return {
        fromUrl: generateFromUrl(keyword, clientData),
        toUrl: generateToUrl(keyword, clientData),
        originalKeywordId: keyword.originalKeywordId,
        clientId: clientData.id
    }
}

exports.prepareForProxyConsumption = function prepareForProxyConsumption(keywordsObject, clientId) {
    return getClientData(clientId).then(function(clientData) {
        return generateTargetKsets(keywordsObject, clientData[0]);
    });
};
