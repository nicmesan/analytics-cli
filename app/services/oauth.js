var google = require('googleapis');
var tokenManager = require('./token-manager');
var OAuth2Client = google.auth.OAuth2;
var oauth2Client = new OAuth2Client('a', 'bb', 'c');

google.options({
    auth: oauth2Client
});

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/analytics', 'https://www.googleapis.com/auth/webmasters.readonly']
});

function getAccessToken() {
    return tokenManager.getToken('googleApiAccessToken');
}

function getRefreshToken() {
    return tokenManager.getToken('googleApiRefreshToken');
}

function setExistingCredentials() {
    return getAccessToken().then((accessToken) => {
        return getRefreshToken().then((refreshToken) => {
            console.log("Setting credentials to", accessToken, "and", refreshToken);
            oauth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken
            });
        })
    });
}

exports.url = url;
exports.oauth2Client = oauth2Client;
exports.setExistingCredentials = setExistingCredentials;
