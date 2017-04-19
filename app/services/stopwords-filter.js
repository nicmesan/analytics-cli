var knex = require("../../config/knex.js");
var winston = require('winston');
var Promise = require('bluebird');
var _ = require('lodash');

// [{name: [belleza,producto], description: [producto, copado, belleza]}]

function splitKset (kset) {
    return kset.split(' ');
}

function isStopWord(word, stopWords) {
   return _.includes(stopWords, word)
}

function removeStopWords (kset, stopWords) {
    return kset.filter((word) => {
        return isStopWord(word, stopWords)
    })
}

function doesKsetExistAsProduct (kset, productKeyWords) {
    return _.intersection(kset, productKeyWords).length === kset.length;
}

function joinNameAndDescription (product) {
   return  _.union(splitKset(product.name), splitKset(product.description))
}

function filterKsetByProductList (ksetWithoutStopWords, productList) {
    return productList.some((product) => {
        return doesKsetExistAsProduct(ksetWithoutStopWords, joinNameAndDescription(product))
    })
}

function filterKsetListByProductList (ksetList, productList) {
    ksetList.filter((kset) => {
        return filterKsetByProductList(kset, productList)
    })
}

function filterStopWordsInKsetList(ksetList, stopWords) {
    return ksetList.map((kset) => {
        return removeStopWords(kset, stopWords);
    })
}

function getStopWords (clientId) {
    return knex.select('keyword').from('stopwords').where('clientId','=', clientId);
}

function getKsets (clientId) {
    return knex.select('keys', 'keySetId').from('ksets').where('clientId','=', clientId);
}

function getProducts (clientId) {
    return knex.select('name', 'description').from('products').where('clientId','=', clientId);
}

exports.applyProductFilter = function (clientId) {
    let stopWords = getStopWords(clientId);
    let ksets = getKsets(clientId);
    let products = getProducts(clientId);

    return Promise.join(stopWords, ksets, products, (stopWords, ksets, productList) => {
        let filteredKsets = filterStopWordsInKsetList(stopWords, ksets);

        let ksetsFilteredByProducts = filterKsetListByProductList(filteredKsets, productList)

        return knex.transaction(function(trx) {
            knex.insert(ksetsFilteredByProducts)
                .into('product_filtered_ksets')
                .transacting(trx)
                .then(trx.commit)
                .catch(trx.rollback);
        });
    })
};














// //Private
//
// function getBusinessFilteredKsets(clientId) {
//     return knex.select('id', 'keys', 'keySetId').from('business_filtered_ksets');
// }
//
// function insertUnstoppedKsets(whiteKsets) {
//     var formattedWhiteKsets = whiteKsets.map(function (kset) {
//         return formatKset(kset);
//     });
//     return knex.transaction(function (trx) {
//         knex.insert(formattedWhiteKsets)
//             .into('unstopped_ksets')
//             .transacting(trx)
//             .then(trx.commit)
//             .catch(trx.rollback);
//     });
// }
//
// function isStopword(keyword) {
//     console.log('keyword', keyword)
//     return knex('stopwords').count('keyword').where('keyword', '=', keyword).then(function (result) {
//         var ocurrences = result[0]['count(`keyword`)'];
//         return (ocurrences === 0);
//     });
// }
//
// function formatKset(kset) {
//     return {
//         keys: kset.keys,
//         ksetId: kset.ksetId
//     }
// }
//
// function filterStopwords(keys) {
//     return Promise.filter(keys.split('-'), function (keyword) {
//         return isStopword(keyword);
//     }).then(function (filteredKeywordsArray) {
//         return filteredKeywordsArray.join('-');
//     });
// }
//
//
// function filterStopwordsOnKset(kset) {
//     return filterStopwords(kset.keys.replace(' ', '-'))
//         .then(function (filteredKeys) {
//             kset.keys = filteredKeys;
//             return kset;
//         });
// }
//
// //Public
// module.exports = {
//     filterStopwords: function (clientId) {
//         winston.info("Filtering ksets with negative keywords for client " + clientId);
//
//         return getBusinessFilteredKsets(clientId)
//             .then(function (ksets) {
//                 console.log(ksets)
//                 return Promise.map(ksets, function (kset) {
//                     return filterStopwordsOnKset(kset);
//                 })
//                     .then(function (res) {
//                         return insertUnstoppedKsets(res);
//                     });
//             });
//     }
// };
