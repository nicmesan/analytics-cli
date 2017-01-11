var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var timeUtils = require('../utils/time_formatter');

function searchConsoleFetch(accessToken, domain, rows, options ) {

    auth.setExistingCredentials();

    rows = rows || 'all';
    options = options || {};
    options.dimensions = options.dimensions || ['page'];
    options.startDate = options.startDate || timeUtils.getPastXDays(90).startDate;
    options.endDate = options.endDate || timeUtils.getPastXDays(90).endDate;
    options.startRow = options.startRow || 0;

    var result = [];
    var rowBatch = rows >= 5000 || rows === 'all' ? 5000 : rows;
    var requestsNumber = Math.floor(rows/rowBatch) - 1 ;
    var lastRequestBatch = rows%rowBatch;

    function fetchData () {
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
                    'rowLimit': rowBatch
                }
            }, function(err, resp) {
                if (err) { console.log(err) }

                else if (resp.rows.length === 0) {
                    console.log('result length', result.length);
                    return result;
                }

                else if (rows === 'all') {
                    result = result.concat(resp.rows);
                    options.startRow += 5000;
                    fetchData();
                }

                else if (requestsNumber === 0) {
                    if (lastRequestBatch === 0) {
                        result = result.concat(resp.rows);
                        console.log('result length', result.length);
                        return result;
                    }

                    else {
                        result = result.concat(resp.rows);
                        rowBatch = lastRequestBatch;
                        lastRequestBatch = 0;
                        fetchData();
                    }
                }

                else {
                    requestsNumber -= 1;
                    result = result.concat(resp.rows);
                    options.startRow += rowBatch;
                    fetchData();
                }

            }
        )
    }

    fetchData();
}


exports.searchConsoleFetch = searchConsoleFetch;
