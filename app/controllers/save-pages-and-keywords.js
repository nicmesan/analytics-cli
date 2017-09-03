const winston = require('winston');
let savePagesService = require('../services/save-pages');
let savekeywordsService = require('../services/save-keywords');
let validator = require('../utils/required-parameter-validator');
let Promise = require('bluebird');

module.exports = function (req, res, next) {

    let pageSize = req.body.pageSize;
    let orderBy = req.body.orderBy;
    let clientData = req.context.clientData;

    validator.validateRequiredParameters({
        pageSize: pageSize,
    });

    return savePagesService(pageSize, orderBy, clientData)
        .catch(function (err) {
            next(err);
        })
        .then(()=>{
            //Waiting some time for pages to be available for querying in ES
            return Promise.delay(10000);
        })
        .then(() => {
            return savekeywordsService(clientData);
        })
        .then((rejectedPromises) => {
            if (rejectedPromises.length < 1) {
                winston.info("Keywords correctly saved");
                res.status(200).json({message: "Keywords were correctly saved"})
            } else {
                winston.error(`Keywords saved, ${rejectedPromises.length} pages couldn't be saved. Pages with errors: `, rejectedPromises);
                res.status(200).json({
                    message: `Keywords saved, ${rejectedPromises.length} pages couldn't be saved`,
                    failedPages: rejectedPromises
                })
            }
        })
        .catch(function (err) {
            next(err);
        })
};
