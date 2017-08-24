let Promise = require('bluebird');
let searchConsole = require('../lib/search-console');
let winston = require('winston');
let errors = require('../errors');
let searchEs = require('../utils/search-es');
let knex = require('../../config/knex');
let validator = require('../utils/required-parameter-validator');

function getPagesData(clientKey) {
    var body = {
        query: {
            match: {
                clientKey: clientKey
            }
        }
    };
    return searchEs(clientKey, 'pages', body)
};

module.exports = function (req, res, next) {

    let clientData = req.context.clientData;
    let clientKey = clientData.clientKey;
    let pagesProcessed;

    return getPagesData(clientKey).then((pages) => {

        if (pages.length < 1) {
            res.status(500).json({message: "No pages associated with this client ID"})
        }

        else {

            pagesProcessed = pages;
            let promisesList = [];
            for (let i = 0; i < pages.length; i += 5) {

                let pagesBatch = pages.slice(i, i + 5);

                pagesBatch.forEach(function (page) {
                    promisesList.push(
                        Promise.delay(i/5 * 1500).then(function () {
                            return searchConsole.saveKeywordsByPage(page, clientData)
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

                    if (rejectedPromises.length < 1) {
                        winston.info("Keywords correctly saved");
                        res.status(200).json({message: "Keywords were correctly saved"})
                    }

                    else {
                        winston.info(`Keywords saved, ${rejectedPromises.length} pages couldn't be saved. Pages with errors: `, rejectedPromises);
                        res.status(200).json({
                            message: `Keywords saved, ${rejectedPromises.length} pages couldn't be saved`,
                            failedPages: rejectedPromises
                        })
                    }
                })
        }
    })
        .catch(function (err) {
            winston.error('Keywords could not be saved', err);
            next(err)
        })
};