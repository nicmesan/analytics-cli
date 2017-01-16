var google = require('googleapis');
var analytics = google.analyticsreporting('v4');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');

function getViewIdByClientId (clientId) {
    return knex.select('viewId').from('tokens').where('id','=', clientId).then(function(res) {
        return res[0].viewId;
    })
}

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

function saveTopValuePages(pageSize, clientId) {
    var config = {
        pageSize: pageSize,
        metrics: [{"expression":"ga:pageValue"}],
        dimensions: [
            { name: 'ga:pagePath' },
            { name: "ga:segment" }
            ],
        orderBys: [
            {
                "sortOrder": "DESCENDING",
                "fieldName": "ga:pageValue"
            }
        ],
        segments: [
            {
                "segmentId": "gaid::TRNU4qP8Q6K5L8nPDicJaA"
            }
        ]
    };

    return Promise.resolve(googleAnalyticsFetch(clientId, config));

}

function fetch (viewId, options) {
    console.log('request', viewId, options)
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
                                    "startDate": options.startDate,
                                    "endDate": options.endDate
                                }],
                            "metrics": options.metrics,
                            "orderBys": options.orderBys,
                            "segments": options.segments,
                            "dimensions": options.dimensions,
                            "samplingLevel":  "LARGE",
                            "pageSize": options.pageSize,
                            "includeEmptyRows": true
                        }]
            }
        }, function (err, resp) {
            if (err) {
                reject(err)
            } else {
                resolve(resp)
            }
        })
    })
}


function googleAnalyticsFetch(clientId, options) {

    options = Object.assign({
        rows: 10000,
        metrics: [{"expression":"ga:pageviews"}],
        dimensions: [{"name":'ga:pagePath'}],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        orderBys: {},
        segments: []
    }, options);

    return auth.setExistingCredentials(clientId)
        .then(function() {
            return getViewIdByClientId(clientId);
        }).then(function(viewId) {
            return fetch(viewId, options)
        }).then(function(response) {
            return response;
        });

}

exports.saveTopValuePages = saveTopValuePages;
