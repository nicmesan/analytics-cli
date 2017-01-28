var google = require('googleapis');
var tokenManager = require('./token-manager');
var OAuth2Client = google.auth.OAuth2;
var clientSecret = require('../../client_secret.json');
var oauth2Client = new OAuth2Client(clientSecret.web['client_id'], clientSecret.web['client_secret'], clientSecret.web['redirect_uris'][0]);
var Promise = require('bluebird');
var winston = require('winston');

google.options({
    auth: oauth2Client
});

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/analytics', 'https://www.googleapis.com/auth/webmasters.readonly']
});

function getAccessToken(clientId) {
    return Promise.resolve(tokenManager.getToken('googleApiAccessToken', clientId));
}

function getRefreshToken(clientId) {
    return Promise.resolve(tokenManager.getToken('googleApiRefreshToken', clientId));
}

function setExistingCredentials(clientId) {
    return getAccessToken(clientId).then(function(accessToken)  {
        return getRefreshToken(clientId).then(function (refreshToken) {
            oauth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken
            });
            winston.info('Setting oauth2 credentials');
        })
    });
}

exports.url = url;
exports.oauth2Client = oauth2Client;
exports.setExistingCredentials = setExistingCredentials;
