let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let Queue = require('promise-queue');
let baseEquivalenceQuery = require('../queries/insert-base-equivalence-classes');

//Private

function registerBaseEquivalenceClasses() {
    winston.info("Registering base equivalence classes");
    return knex.raw(baseEquivalenceQuery)
        .then(function () {
            winston.info("Base equivalence classes where registered OK");
        }).catch(function (err) {
            winston.error("There was an error inserting base equivalence classes", err);
            throw Error("There was an error inserting base equivalence classes", err);
        });
};

function getNthEquivalenceClass(n) {
    return knex.select('*').from('product_match_equivalence_classes').then(function (result) {
        return result[0]
    });
}

function evaluateNthEquivalenceClass(n, amountOfEquivalenceClasses) {

    return getNthEquivalenceClass(n).then(function(eqClass) {

            //Implement comparison
    })


}

function getAmountOfEquivalenceClasses() {
    return knex.select('count(*)').from('product_match_equivalence_classes').then(function (result) {
        return result[0]
    });
}


module.exports = function (clientId) {

    winston.info("Initiating keyord similarity filter");

    //Must return below promise once debugged and working.
    registerBaseEquivalenceClasses()
        .then(function () {
            return getAmountOfEquivalenceClasses()
        })
        .then(function (amountOfEquivalenceClasses) {
            let promiseList = [];
            for (i = 0; i < amountOfEquivalenceClasses; i++) {
                promiseList.push(_.partial(evaluateNthEquivalenceClass, i, amountOfEquivalenceClasses));
            }
        });

    return Promise.resolve(1); //Placeholder

};

