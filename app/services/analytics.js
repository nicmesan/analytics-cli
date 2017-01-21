var google = require('googleapis');
var analytics = google.analyticsreporting('v4');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');
var Promise = require('bluebird');

exports.getViewIdByClientId = function (clientId) {
    return knex.select('viewId').from('clients').where('id','=', clientId).then(function(res) {
        return res[0].viewId;
    })
};

exports.fetch = function (viewId, options) {

    options = Object.assign({
        rows: 10000,
        metrics: [{"expression":"ga:pageviews"}],
        dimensions: [{"name":'ga:pagePath'}],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        orderBys: {},
        segments: []
    }, options);

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
};
