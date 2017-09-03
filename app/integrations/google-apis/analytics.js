var google = require('googleapis');
var analytics = google.analyticsreporting('v4');
var Promise = require('bluebird');
var winston = require('winston');
var auth = require('./oauth');
var timeUtils = require('../../utils/time_formatter');
var errors = require('../../errors');

function getPages(pageSize, viewId, orderBy) {
    var options = getAnalyticsOptions(pageSize, orderBy);
    return fetch(viewId, options)
        .catch(function (error) {
            throw errors.httpError("Get pages error", error);
        });
};

function getAnalyticsOptions(pageSize, orderBy) {
    return {
        pageSize: pageSize,
        metrics: [
            {"expression": "ga:pageValue"},
            {"expression": "ga:sessions"}
        ],
        dimensions: [
            {name: 'ga:pagePath'},
            {name: "ga:segment"}
        ],
        orderBys: [
            {
                "sortOrder": "DESCENDING",
                "fieldName": orderBy || "ga:pageValue"
            }
        ],
        segments: [
            {
                "segmentId": "gaid::TRNU4qP8Q6K5L8nPDicJaA"
            }
        ]
    };
}

function fetch(viewId, options) {

    var formattedOptions = formatOptions(options);

    return new Promise(function(resolve, reject) {
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
                                    "startDate": formattedOptions.startDate,
                                    "endDate": formattedOptions.endDate
                                }],
                            "metrics": formattedOptions.metrics,
                            "orderBys": formattedOptions.orderBys,
                            "segments": formattedOptions.segments,
                            "dimensions": formattedOptions.dimensions,
                            "samplingLevel":  "LARGE",
                            "pageSize": formattedOptions.pageSize,
                            "includeEmptyRows": true
                        }]
            }
        }, function (err, resp) {
            if (err) {
                reject(err);
                winston.error('Error gathering analytics pages', {
                    response: resp,
                    error: err,
                    options: formattedOptions
                });
            } else {
                resolve(resp);
                winston.info(resp.reports[0].data.rows.length + ' pages were gathered from Analytics', {
                    origin: "analytics-cli.integrations.analytics.get-pages",
                    entity: 'pages'
                });
            }
        })
    })
};

function formatOptions(options) {
    return Object.assign({
        rows: 10000,
        metrics: [{"expression":"ga:pageviews"}],
        dimensions: [{"name":'ga:pagePath'}],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        orderBys: {},
        segments: []
    }, options);
}

exports.getPages = getPages;
