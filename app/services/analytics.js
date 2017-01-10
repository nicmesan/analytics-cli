var google = require('googleapis');
var analytics = google.analyticsreporting('v4');
var auth = require('./oauth');
var timeUtils = require('../utils/time_formatter');

function mapParameters(options) {
    var dimensions;
    var metrics;

    if(!!options.metrics) {
        metrics = options.metrics.map(function(metric){
            return {"expression": 'ga:' + metric}
        });
    }

    if(!!options.dimensions) {
        dimensions = options.metrics.map(function(dimension){
            return {"name": 'ga:' + dimension}
        });
    }

    return {
        metrics: metrics,
        dimensions: dimensions
    }

}

function googleAnalyticsFetch(accessToken, viewId, rows, options) {

    auth.oauth2Client.setCredentials(accessToken);

    options = options || {};
    rows = rows || 'all';
    options.metrics = mapParameters(options).metrics || [{"expression":"ga:pageviews"}];
    options.dimensions = mapParameters(options).dimensions || [{"name":'ga:pagePath'}];
    options.startDate = options.startDate || timeUtils.getPastXDays(90).startDate;
    options.endDate = options.endDate || timeUtils.getPastXDays(90).endDate;
    options.orderBy = options.orderBy || {};

    var result = [];
    var pageToken = null;
    var rowBatch = rows >= 10000 || rows === 'all' ? 10000 : rows;
    var rowsRemaining = rows;

    function fetchData () {
        analytics.reports.batchGet({
            headers: {
                "Content-Type": "application/json"
            },
            auth: auth.oauth2Client,
            "resource": {
                "reportRequests":
                    [
                        {
                            "viewId": viewId,
                            "dateRanges":[
                                {
                                    "startDate": options.startDate,
                                    "endDate": options.endDate
                                }],
                            "metrics": options.metrics,
                            "dimensions": options.dimensions,
                            "orderBy": options.orderBy,
                            "samplingLevel":  "LARGE",
                            "pageSize": rowBatch,
                            "pageToken": pageToken
                        }]
            }
        }, function (err, resp) {
            if (err) { console.log(err) }
            else {
                rowsRemaining -= rowBatch;
                console.log('rows remaining', resp.reports[0].data.rows.length);
                console.log('nexttoken', resp.reports[0].nextPageToken);
                console.log('respond length', resp.reports[0].data.rows.length)
                if (resp.reports[0].data.rows.length === 0) {
                    console.log('length final', result);
                    return result;
                }

                else if (!resp.reports[0].nextPageToken) {
                    result = result.concat(resp.reports[0].data.rows);
                    console.log('length final', result.length);
                    return result;
                }

                else if (rows === 'all') {
                    result = result.concat(resp.reports[0].data.rows);
                    pageToken = resp.reports[0].nextPageToken;
                    fetchData();
                }

                else {
                    result = result.concat(resp.reports[0].data.rows);
                    pageToken = resp.reports[0].nextPageToken;

                    if(rowsRemaining !== 0) {
                        rowBatch = rowsRemaining > 10000 ? 10000 : rowsRemaining;
                        fetchData();
                    } else {
                        console.log('termino', result.length);
                        return result;
                    }
                }
            }
        });
    }

    fetchData()
}

exports.googleAnalyticsFetch = googleAnalyticsFetch;
