// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var readline = require('readline');

var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var webmasters = google.webmasters('v3');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '927817271019-udq359d362k7nna6piapcjniqt8k0jmd.apps.googleusercontent.com';
var CLIENT_SECRET = 'G-ODZ3GkbEv_rRqH01vvm7qH';
var REDIRECT_URL = 'http://127.0.0.1:9080';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getAccessToken (oauth2Client, callback) {
    // generate consent page url
    var url = oauth2Client.generateAuthUrl({
        //access_type: 'offline', // will return a refresh token
        scope: 'https://www.googleapis.com/auth/webmasters' // can be a space-delimited string or an array of scopes
    });

    console.log('Visit the url: ', url);
    rl.question('Enter the code here:', function (code) {
        // request access token
        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                return callback(err);
            }
            // set tokens to the client
            // TODO: tokens should be set by OAuth2 client.
            oauth2Client.setCredentials(tokens);
            console.log(tokens);
            callback();
        });
    });
}

// retrieve an access token
getAccessToken(oauth2Client, function () {
    // retrieve user profile
    /*webmasters.searchanalytics.query(
        { auth: oauth2Client,
            startDate: '1990-01-01',
            endDate: '2017-01-01',
            siteUrl: 'http://www.elfindel2012.blogspot.com/'
        }, function (err) {
        if (err) {
            return console.log('An error occured', err);
        }},function(response) {
            console.log(response);
    });*/

    webmasters.searchanalytics.query(
        { 'auth': oauth2Client,
            'start-date': '2000-01-01',
            'end-date': '2018-01-01',
            'siteUrl': 'www.elfindel2012.blogspot.com'
            //key: 'AIzaSyCwPjM0joioObhJPv28cCb_d1SJzLhnFNA'
        }, function(err, resp, a ) {
            console.log(resp);
            console.log(err);
            //console.log(a);
        });




});


