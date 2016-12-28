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

oauth2Client.setCredentials({ access_token: 'ya29.Ci-7AxFVwhEKilQImTV7PAXJ_cASJgylKL5ZFenAFcOWtv0X4OkJ1fJt1KK3RQqLQA',
    token_type: 'Bearer',
    expiry_date: 1482360715766 }
);



    webmasters.searchanalytics.query(
        { 'auth': oauth2Client,
            'body': {
                'startDate': '2000-01-01',
                'endDate': '2018-01-01',
            },
            'siteUrl': 'www.elfindel2012.blogspot.com'
            //key: 'AIzaSyCwPjM0joioObhJPv28cCb_d1SJzLhnFNA'
        }, function(err, resp, a ) {
            console.log(resp);
            console.log(err);
            //console.log(a);
        });



