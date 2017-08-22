/**
 * Created by javieranselmi on 8/20/17.
 */
var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var clientSecret = {
    "web": {
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "client_id": "927817271019-icj7p9flmpfrend88c6a5lmttr1dvu1i.apps.googleusercontent.com",
        "client_secret": "LnCL8tDdNfVciumQ1D8X2cAU",
        "project_id": "keywords-gathering",
        "redirect_uris": [
            "http://localhost:8080/auth"
        ],
        "token_uri": "https://accounts.google.com/o/oauth2/token"
    }
}
var oauth2Client = new OAuth2Client(clientSecret.web['client_id'], clientSecret.web['client_secret'], clientSecret.web['redirect_uris'][0]);

var Promise = require('bluebird');


oauth2Client.getToken('4/MRWC0xK5mEKanV3wDYUia5TreVKwhTz4Uw-SMAb_aeA', function (err, tokens) {
    console.log(err, tokens);
return;
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
        oauth2Client.setCredentials(tokens);
    }
});