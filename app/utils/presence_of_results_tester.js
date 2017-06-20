'use strict';

var knex = require('../../config/knex');
var http = require('https');
Promise = require('bluebird')

knex.select('toUrl').from('target_keywords').then((result) => {

    console.log('Total keywords retrieved: ', result.length);

    return Promise.each(result, function (payment, index) {

        var options = {
            host: 'vivisaludable.com',
            path: '/'+ result.toUrl,
            method: 'GET'
        };

        return new Promise(function (resolve, reject) {

            http.get(options, function (res) {
                res.setEncoding('utf8');
                var body = '';

                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    //console.log(body);
                    //console.log(res);
                    var hasNoResults = (body.indexOf('No hay ningún resultado de su búsqueda') > -1)? 'No results' : 'Found results';
                    console.log('Analyzed keyword ' + (index + 1) + '/' + result.length + ' | ' + hasNoResults);
                    resolve('1');
                });

            });
        });
    }).catch(function (err) {
        console.log("Error reading payment.");
    }).then(function () {
        process.exit();
    });
});