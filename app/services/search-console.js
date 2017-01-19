//Dependencies

var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');

//Methods

function getDomainByClientId (clientId) {
    return knex.select('siteName').from('clients').where('id','=', clientId).then(function(res) {
        return res[0].siteName;
    })
}

function getPagePathByPageId (pageId) {
    return knex.select('dimensions').from('pages').where('id','=', pageId).then(function(res) {
        return res[0].dimensions;
    })
}


function getFilter(dimension, operator, expression) {
    return {
        dimension: dimension,
        operator: operator,
        expression: expression
    }
};

function getKsetGroup(start, pageId, clientId) {

    return getPagePathByPageId(pageId).then(function(path) {
        return getDomainByClientId(clientId).then(function(domain) {
            var fullUrl = 'http://' + domain + path;
            var config = {
                startRow: start,
                dimensions: ['query'],
                filters: [ getFilter('page', 'equals', fullUrl) ]
            };

            return Promise.resolve(fetchWithDefaults(domain, config, clientId));
        })

    });



}


function fetch(domain, options) {
    return new Promise(function(resolve, reject) {
        webmasters.searchanalytics.query(
            {
                'access_token': auth.oauth2Client,
                'siteUrl': domain,
                'fields': 'responseAggregationType,rows',
                'resource': {
                    'startDate': options.startDate,
                    'endDate': options.endDate,
                    'dimensions': options.dimensions,
                    'dimensionFilterGroups': [
                        {'filters': options.filters}
                    ],
                    'startRow': options.startRow,
                    'rowLimit': 5000
                }
            }, function (err, resp) {
                if (err) {
                    reject(err)
                } else {
                    resolve(resp)
                }
            });
    });
}


function fetchWithDefaults(domain, options, clientId) {

    options = Object.assign({
        rows: 5000,
        dimensions: ['page'],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        startRow: 0
    }, options);

    return auth.setExistingCredentials(clientId)
        .then(function() {
            return fetch(domain, options)
        }).then(function(response) {
           return response;
        });

}

exports.getKsetGroup = getKsetGroup;
