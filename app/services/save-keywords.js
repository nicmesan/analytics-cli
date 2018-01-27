let Promise = require('bluebird');
let searchConsole = require('../integrations/google-apis/search-console');
let winston = require('winston');
let errors = require('../errors');
let elasticsearch = require('../integrations/elasticsearch');
let validator = require('../utils/required-parameter-validator');
let constants = require('../constants');

function getPagesData(clientKey) {
    var body = {
        query: {
            match: {
                clientKey: clientKey
            }
        }
    };
    return elasticsearch.query(clientKey, 'pages', body)
};

module.exports = function (clientData, runId) {

    let clientKey = clientData.clientKey;
    let pagesProcessed;

    return getPagesData(clientKey).then((pages) => {

        if (pages.length < 1) {
            throw new errors.httpError("No pages associated with this client ID");
        }

        else {
            pagesProcessed = pages;
            let promisesList = [];
            for (let i = 0; i < pages.length; i += 5) {

                let pagesBatch = pages.slice(i, i + 5);

                pagesBatch.forEach(function (page) {
                    promisesList.push(
                        // Quota: 5 Queries Per Second
                        // Quota: 200 Queries Per Minute
                        Promise.delay(i / 5 * constants.delayBetweenEachGoogleQueryBatch).then(function () {
                            return searchConsole.saveKeywordsByPage(page, clientData, runId)
                        })
                    );
                });
            }

            return Promise.all(promisesList.map((promise) => {
                return promise.reflect();
            }))

                .then((result) => {

                    let rejectedPromises = [];

                    result.forEach((promise, index) => {
                        if (!promise.isFulfilled()) {
                            rejectedPromises.push(pagesProcessed[index].pagePath)
                        }

                    });

                    return rejectedPromises;

                });

        }

    });

};