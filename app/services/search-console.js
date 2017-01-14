//Dependencies

var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var timeUtils = require('../utils/time_formatter');

//Methods

function getFilter(dimension, operator,  expression) {
    return {
        dimension: dimension,
        expression: operator,
        operator: expression
    }
};

function getKsetGroup(start, take, page) {
    var config = {
        startRow: start,
        dimensions: 'query',
        filters: [ getFilter('page', 'equals', page.url) ]
    };
    fetchWithDefaults(page.url, take, config)

};


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
                    'filters': options.filters,
                    'startRow': options.startRow,
                    'rowLimit': 5000,
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


function fetchWithDefaults(domain, rows, options) {

    auth.setExistingCredentials();
    //auth.oauth2Client.
    rows = rows || 'all';
    options = options || {};
    options.filters = options.filters || [];
    options.dimensions = options.dimensions || ['page'];
    options.startDate = options.startDate || timeUtils.getPastXDays(90).startDate;
    options.endDate = options.endDate || timeUtils.getPastXDays(90).endDate;
    options.startRow = options.startRow || 0;

    var result = [];
    var rowBatch = rows >= 5000 || rows === 'all' ? 5000 : rows;
    var requestsNumber = Math.floor(rows/rowBatch) - 1 ;
    var lastRequestBatch = rows % rowBatch;

    auth.setExistingCredentials().then(()=> {
        fetch(domain, options).then(function(response) {
            console.log("ANDUVO JOYA!", response);
        })
    })

}

fetchWithDefaults('vivisaludable.com', 'all', null);

exports.fetch = fetchWithDefaults;
