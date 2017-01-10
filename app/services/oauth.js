var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;

var oauth2Client = new OAuth2Client('a', 'bb', 'c');

google.options({
    auth: oauth2Client
});

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/analytics', 'https://www.googleapis.com/auth/webmasters.readonly']
});

exports.url = url;
exports.oauth2Client = oauth2Client;
