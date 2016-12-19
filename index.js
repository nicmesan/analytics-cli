var google = require('googleapis');
var analytics = google.analytics('v3');
var OAuth2 = google.auth.OAuth2;
var jwt = google.auth.JWT;
var prompt = require('prompt');
var key = require('./My Project-f2682a9bca9a.json')

prompt.start();

var jwtClient = new google.auth.JWT(
    key.client_email, null, key.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly'], null);
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    var analytics = google.analytics('v3');
});


function queryData(analytics, metric, dimension, start, end) {
    analytics.data.ga.get({
        'auth': jwtClient,
        'ids': 'ga:89286882',
        'metrics': 'ga:' + metric,
        'dimensions': dimension ? 'ga:' + dimension : null,
        'start-date': start,
        'end-date': end,
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.stringify(response, null, 4));
    });
}



prompt.get(['metric', 'dimension', 'start', 'end'], function (err, result) {

    queryData(analytics, result.metric, result.dimension, result.start, result.end)
});