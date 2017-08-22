//Dependencies
var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');
var winston = require('winston');
var errors = require('../errors');


//Methods

exports.getPagePathByPageId = function (pageId) {
    return knex.select('pagePath').from('pages').where('id', '=', pageId)
        .then(function (res) {
            if (res.length < 1) {
                throw errors.httpError('Page ID not found')
            }
            return res[0].pagePath;
        })
};

exports.getFilter = function (dimension, operator, expression) {
    return {
        dimension: dimension,
        operator: operator,
        expression: JSON.parse(JSON.stringify(expression))
    }
};

exports.fetch = function (domain, options) {

    options = Object.assign({
        rows: 5000,
        dimensions: ['page'],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        startRow: 0
    }, options);

    return new Promise((resolve, reject) => {
        var o = {
            'auth': auth.oauth2Client,
            'siteUrl': encodeURIComponent('https://' + domain ),
            'fields': 'rows',
            'resource': {
                'dimensionFilterGroups': [
                    {'filters': options.filters}
                ],
                'startDate': options.startDate,
                'endDate': options.endDate,
                'dimensions': options.dimensions,
                'startRow': options.startRow,
                'rowLimit': 5000
            }
        };

        webmasters.searchanalytics.query(o,
            (error, result) => {
                if (error) {
                    error.statusCode = Number(error.code) || 500;
                    console.log('Error searching keywords for page' + options.filters[0].expression, error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};
