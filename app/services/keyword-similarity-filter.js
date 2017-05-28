let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let Queue = require('promise-queue');
let _ = require('lodash');
let queries = require('../queries/queries');
let BUSSINESS_CONSTANTS = require('../bussiness_contants')

function getAndDeleteFirstEquivalenceClass() {
    return knex("product_matches_grouped_unique").select("*").limit(1)
        .then((eqClass) => {
            return eqClass[0];
        });
};

function similarityFilter(eqClass) {
    var count = eqClass.productMatchVector.split(",").length;
    return knex.raw(queries.similarityFilter, [count, eqClass.originalKeywordId]);
};

function similarityFinalClassesInsert() {
    return knex.raw(queries.similarityFinalClassesInsert, [BUSSINESS_CONSTANTS.similarityThreshold]);
};

function deleteFromGroupedUnique() {
    return knex.raw(queries.deleteFromGroupedUnique, [BUSSINESS_CONSTANTS.similarityThreshold]);
}

function truncateProductMatchesSimilarity() {
    return knex("product_matches_similarity").truncate();
}

function processEqClass() {
    return getAndDeleteFirstEquivalenceClass()
        .tap((eqClass) => {
            console.log('got equivalence class', eqClass);
        }).then((eqClass) => {
            return similarityFilter(eqClass);
        }).then(() => {
            return similarityFinalClassesInsert();
        }).then(() => {
            return deleteFromGroupedUnique();
        }).then(() => {
            return truncateProductMatchesSimilarity();
        });
};
module.exports = function (clientId) {

    winston.info("Initiating keyword similarity filter");

    return processEqClass();

    //return Promise.resolve(1); //Placeholder

};

