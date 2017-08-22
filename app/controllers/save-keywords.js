let Promise = require('bluebird');
let searchConsole = require('../lib/search-console');
let winston = require('winston');
let errors = require('../errors');
let searchEs = require('../utils/search-es');
let knex = require('../../config/knex');

function getPagesData(clientId) {
    var body = {
        query: {
            match_all: {}
        },
    };
    return searchEs(clientId, 'pages', body)
};

function getClientData(clientId) {
    return knex.select('id','siteName').from('clients').where('id', '=', clientId).then(function (res) {
        if (res.length < 1 || !res[0].siteName) {
            throw errors.httpError('Domain not found for client ID provided')
        }
        return res[0];
    })
}


module.exports = function (req, res, next) {
    let clientId = req.params.clientId;
    let pagesProcessed;

    let getClientDataPromise = getClientData(clientId);

    return Promise.join(getClientDataPromise, getPagesData(clientId), function (clientData, pages)
        {
            if (pages.length < 1) {
                res.status(200).json({message: "No pages associated with this client ID"})
            }

            else {

                pagesProcessed = pages;
                let promisesList = [];
                for (let i = 0; i < pages.length; i += 5) {

                    let pagesBatch = pages.slice(i, i + 5);

                    pagesBatch.forEach(function (page) {
                        promisesList.push(
                            Promise.delay(i * 1500).then(function () {
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