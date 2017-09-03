//Dependencies
let google = require('googleapis');
let webmasters = google.webmasters('v3');
let auth = require('./oauth');
let timeUtils = require('../../utils/time_formatter');
let winston = require('winston');
let errors = require('../../errors');
let Promise = require("bluebird");
let keywordValue = require('../../lib/keyword-value');
let elasticsearch = require('../elasticsearch');
let productFinder = require('../../services/product-finder');

//Methods

function getFilter(dimension, operator, expression) {
    return {
        dimension: dimension,
        operator: operator,
        expression: JSON.parse(JSON.stringify(expression))
    }
};

function fetch(domain, options) {

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
            'siteUrl': encodeURIComponent('https://' + domain),
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
                    winston.error('Error searching keywords for page ' + options.filters[0].expression, error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};

function formatRow(row, clientKey, pagePath) {

    return {
        keyword: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        page: pagePath,
        keywordValue: keywordValue.getKeywordBusinessValue(row.position, row.impressions),
        clientKey: clientKey
    }
}

exports.saveKeywordsByPage = function (pageData, clientData) {

    let fullUrl = 'https://' + pageData.pagePath;
    let options = {
        startRow: 1,
        dimensions: ['query'],
        filters: [getFilter('page', 'equals', fullUrl)]
    };

    return fetch(clientData.siteName, options)
        .then(function (data) {

            let dataToSave = data.rows;
            let formattedKeywords = [];

            if (dataToSave) {
                winston.info(data.rows.length + ' keywords fetched from page \'' + pageData.pagePath + '\'', {
                    page: pageData.pagePath,
                    origin: 'analytics-cli.integrations.google-apis.search-console.fetch',
                    siteName: clientData.siteName,
                    client: clientData.clientKey,
                    amount: data.rows.length
                });

                formattedKeywords = dataToSave.map((row) => {
                    return formatRow(row, clientData.clientKey, pageData.pagePath)
                });
            } else {
                winston.info('No keywords! (0) keywords fetched from page \'' + pageData.pagePath + '\'',
                    {
                        page: pageData.pagePath,
                        origin: 'analytics-cli.integrations.google-apis.search-console.fetch',
                        siteName: clientData.siteName,
                        client: clientData.clientKey,
                    });
                return null;
            }
            return formattedKeywords;
        })
        .then(function (formattedKeywords) {
            if (formattedKeywords.length > 0) {
                return elasticsearch.insert(clientData.clientKey, 'keywords', formattedKeywords);
            }
        })
        .catch(function (err) {
            winston.error('Error saving page keywords', err);
            throw new errors.keywordSaveError('Save keywords error', err)
        })
};