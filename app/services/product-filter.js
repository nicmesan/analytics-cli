let knex = require("../../config/knex.js");
let errors = require('../errors');
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let BUSSINESS = require('../bussiness_contants');


function splitKset(kset) {
    return kset.split(' ');
}

function isStopWord(word, stopWords) {
    return _.includes(stopWords, word)
}

function removeStopWords(kset, stopWords) {
    let keyWordsArray = kset.keys.split(' ');

    let keys = keyWordsArray.filter((word) => {
        return !isStopWord(word, stopWords)
    });

    return {
        'keys': keys,
        'keySetId': kset.keySetId
    }
}

function doesKsetExistAsProduct(kset, productKeyWords) {
    let amountOfCoincidingWords = _.intersection(kset, productKeyWords).length;
    return amountOfCoincidingWords > kset.length * BUSSINESS.productFilterPrecisionCoef;
}

function joinNameAndDescription(product) {
    return _.union(splitKset(product.name), splitKset(product.description))
}

function filterKsetByProductList(ksetWithoutStopWords, productList) {

    return productList.some((product) => {
        return doesKsetExistAsProduct(ksetWithoutStopWords, product)
    })
}

function filterKsetListByProductList(ksetList, productList) {

    let joinedProductList = productList.map(joinNameAndDescription);

    return ksetList.filter((kset) => {
        return filterKsetByProductList(kset.keys, joinedProductList)
    })
}

function filterStopWordsInKsetList(ksetList, stopWords) {
    return ksetList.map((kset) => {
        return removeStopWords(kset, stopWords);
    })
}

function formatFilteredKsetsForDatabase(ksetList) {
    return ksetList.map((kset) => {
        return {
            'kset': kset.keys.join(' '),
            'keySetId': kset.keySetId
        }
    });
}

function getStopWords(clientId) {
    return knex.select('keyword').from('stopwords').where('clientId', '=', clientId);
}

function getKsets(clientId) {
    return knex.select('keys', 'keySetId').from('business_filtered_ksets').where('clientId', '=', clientId);
}

function getProducts(clientId) {
    return knex.select('name', 'description').from('products').where('clientId', '=', clientId);
}

function saveKsets(ksets) {
    knex.transaction(function (trx) {
        knex.insert(ksets)
            .into('product_filtered_ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

exports.applyProductFilter = function (clientId) {
    let stopWords = getStopWords(clientId);
    let ksets = getKsets(clientId);
    let products = getProducts(clientId);
    winston.info('Initializing product filter');
    return Promise.join(stopWords, ksets, products, (stopWords, ksets, productList) => {
        if (stopWords.length === 0) throw Error('No stop words were find in DB');
        if (ksets.length === 0) throw Error('No ksets were find in DB');
        if (productList.length === 0) throw Error('No products were find in DB');

        let stopWordsArray = _.map(stopWords, 'keyword');
        let filteredKsets = filterStopWordsInKsetList(ksets, stopWordsArray);
        let ksetsFilteredByProducts = filterKsetListByProductList(filteredKsets, productList);
        let result = formatFilteredKsetsForDatabase(ksetsFilteredByProducts);

        return saveKsets(result)
    })
        .catch((err) => {
            throw errors.httpError('Product filter error', err)
        })
};
