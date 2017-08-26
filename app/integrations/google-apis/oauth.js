var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var clientSecret = require('../../../client_secret.json');
var oauth2Client = new OAuth2Client(clientSecret.web['client_id'], clientSecret.web['client_secret'], clientSecret.web['redirect_uris'][0]);
var Promise = require('bluebird');

google.options({
    auth: oauth2Client
});

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/analytics', 'https://www.googleapis.com/auth/webmasters.readonly']
});

function setExistingCredentials(refreshToken) {
    return new Promise((resolve, reject) => {
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        resolve();
    });
}

exports.url = url;
exports.oauth2Client = oauth2Client;
exports.setExistingCredentials = setExistingCredentials;
