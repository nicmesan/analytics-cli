var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');
var _ = require('lodash');
var strategies = require('./strategies');

function getClientData (clientId) {
    return knex
        .select('id', 'mainDomain', 'searchDomain', 'searchUrlPrefix', 'searchUrlSuffix', 'strategy', 'separator')
        .from('clients').where('id','=', clientId);
}
function generateFromUrl(kset, clientData) {
    switch(clientData.strategy) {
        case 'REPLACE':
            var options = { separator: clientData.separator };
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
        return generateTargetKset(kset, clientData)
    });
}

function generateTargetKset(kset, clientData) {
    return {
        fromUrl: generateFromUrl(kset, clientData),
        toUrl: generateToUrl(kset, clientData),
        keySetId: kset.keySetId,
        clientId: clientData.id
    }
}

exports.prepareForProxyConsumption = function prepareForProxyConsumption(ksets, clientId) {
    return getClientData(clientId).then(function(clientData) {
        return generateTargetKsets(ksets, clientData[0]);
    });
};
