//Dependencies

var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');

//Methods

function getDomainByClientId (clientId) {
    return knex.select('siteName').from('tokens').where('id','=', clientId).then(function(res) {
        return res[0].siteName;
    })
}

function getFilter(dimension, operator, expression) {
    return {
        dimension: dimension,
        operator: operator,
        expression: expression
    }
};

function getKsetGroup(start, page, clientId) {
    var config = {
        startRow: start,
        dimensions: ['query'],
        filters: [ getFilter('page', 'equals', page) ]
    };

    return Promise.resolve(fetchWithDefaults(clientId, config));

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


function fetchWithDefaults(clientId, options) {

    options = options || {};
    options.rows = options.rows || 5000;
    options.filters = options.filters || [];
    options.dimensions = options.dimensions || ['page'];
    options.startDate = options.startDate || timeUtils.getPastXDays(90).startDate;
    options.endDate = options.endDate || timeUtils.getPastXDays(90).endDate;
    options.startRow = options.startRow || 0;

    return auth.setExistingCredentials(clientId)
        .then(function() {
            return getDomainByClientId(clientId);
        }).then(function(asd) {
            return fetch(asd, options)
        }).then(function(response) {
           return response;
        });

}

exports.getKsetGroup = getKsetGroup;
