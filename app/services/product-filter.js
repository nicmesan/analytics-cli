const knex = require("../../config/knex.js");
const errors = require('../errors');
const winston = require('winston');
const Promise = require('bluebird');
const _ = require('lodash');
const BUSINESS = require('../bussiness_contants');
const promiseLimit = require('promise-limit')

// -- Stop words filter

function isStopWord(word, stopWords) {
    return _.includes(stopWords, word)
}

function removeStopWords(keywordObject, stopWords) {
    let keyWordsArray = keywordObject.keyword.split(' ');

    let keywordWithoutStopWords = keyWordsArray.filter((singleWordInKeyword) => {
        return !isStopWord(singleWordInKeyword, stopWords)
    });

    return {
        'keyword': keywordWithoutStopWords,
        'originalKeywordId': keywordObject.originalKeywordId,
        'id': keywordObject.id,
    }
}

function filterStopWordsInKeywordsList(keywordsList, stopWords) {
    return keywordsList.map((keywordObject) => {
        return removeStopWords(keywordObject, stopWords);
    })
}

// -- Product filter

function doesKeywordExistAsProduct(keywordObject, clientId, index) {

    let keywordsQuery = '';
    let searchOr = '';
    let splitKeywordArray = keywordObject.keyword;

    splitKeywordArray.forEach((singleWordInKeyword) => {
        keywordsQuery += `${searchOr} (name LIKE '%${singleWordInKeyword}%' OR description LIKE '%${singleWordInKeyword}%')`;
        searchOr = 'AND';
    });

    let databaseQuery = `SELECT * FROM products where clientId = ${clientId} AND (${keywordsQuery})`;
    return knex.raw(databaseQuery)
        .then((databaseSearchResult) => {
            return databaseSearchResult[0]
        })
        .tap(function (searchResults) {
            if (searchResults.length >= BUSINESS.minSearchResultsFilter) {
                searchResults.forEach(function (product) {
                    knex.transaction(function (trx) {
                        knex.insert({
                            productId: product.id,
                            originalKeywordId: keywordObject.originalKeywordId,
                            clientId: clientId,
                            businessFilteredKeywordId: keywordObject.id,
                        })
                            .into('product_matches')
                            .transacting(trx)
                            .then(trx.commit)
                            .catch(trx.rollback);
                    });
                })
            }

        })
        .then(function (searchResults) {
            var matches = (searchResults.length >= BUSINESS.minSearchResultsFilter);
            var message = matches ? 'CONTINUES' : 'FILTERED';
            console.log('Keyword matches analized for business_filtered_keyword ' + index + '. Found ' + searchResults.length + ' matches (max:' + BUSINESS.minSearchResultsFilter + '). - ' + message + '.');
            return matches;

        });
}

function filterKeywordListByProductList(keywordsList, clientId) {

    var limit = promiseLimit(BUSINESS.maxConnectionsAllowedToDB);

    return Promise.all(keywordsList.map((keywordObject, index) => {

        return limit(() => doesKeywordExistAsProduct(keywordObject, clientId, index))
    }))
        .then((databaseSearchResult) => {
            return keywordsList.filter((searchResult, index) => {
                return databaseSearchResult[index]
            })
        });
}

function formatFilteredKeywordsForDatabase(productFilteredKeywordsList, clientId) {
    return productFilteredKeywordsList.map((keywordObject) => {
        return {
            'keyword': keywordObject.keyword.join(' '),
            'originalKeywordId': keywordObject.originalKeywordId,
            'clientId': clientId
        }
    });
}

// -- DB Queries

function getStopWords(clientId) {
    return knex.select('keyword').from('stop_keywords').where('clientId', '=', clientId);
}

function getKeywords(clientId) {
    return knex.select('id', 'keyword', 'originalKeywordId').from('business_filtered_keywords').where('clientId', '=', clientId);
}

function saveKeywords(keywordsObjects) {
    return knex.transaction(function (trx) {
        knex.insert(keywordsObjects)
            .into('product_filtered_keywords')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

// -- Public

exports.applyProductFilter = function (clientId) {
    winston.info('Initializing product filter');

    let stopWords = getStopWords(clientId);
    let keywordsObject = getKeywords(clientId);

    return Promise.join(stopWords, keywordsObject, (stopWords, keywordsObject) => {
        if (stopWords.length === 0) throw Error('No stop words were find in DB');
        if (keywordsObject.length === 0) throw Error('No keywords were find in DB');

        let stopWordsArray = _.map(stopWords, 'keyword');

        let filteredKeywords = filterStopWordsInKeywordsList(keywordsObject, stopWordsArray);

        return filterKeywordListByProductList(filteredKeywords, clientId)
            .then((keywordsFilteredByProducts) => {
                let result = formatFilteredKeywordsForDatabase(keywordsFilteredByProducts, clientId);

                return saveKeywords(result)
                    .then(() => {
                        winston.info(`${result.length} keywords successfully saved in DB`);
                    })
            })
    })
        .catch((err) => {
            throw errors.httpError('Product filter error', err)
        })
};
