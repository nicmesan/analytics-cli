/**
 * Created by javieranselmi on 8/26/17.
 */
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let elasticsearch = require('../integrations/elasticsearch');
let constants = require('../constants');

//Private

function formatForSearch(keyword) {
    return {
        _source: ["title","imageUrl","uri"],
        min_score: constants.minimumScoreForProductMatching,
        query: {
            match: {
                description: keyword.keyword
            }
        }
    }
}

exports.getProductsFromKeywords = function (keywords, clientKey) {
    var bodies = _.map(keywords, (keyword) => {
        return formatForSearch(keyword);
    });
    return elasticsearch.bulkQuery(clientKey, 'products', bodies).then((results) => {
        _.each(results.responses, (response, index) => {
            let relatedProductIds = _.map(response.hits.hits, (hit) => {
                return {
                    productId: hit["_id"],
                    score: hit["_score"],
                    title: hit["_source"].title,
                    imageUrl: hit["_source"].imageUrl,
                    url: hit["_source"].uri
                };
            });
            keywords[index].relatedProducts = relatedProductIds;

        });

        let filteredKeywords = _.filter(keywords, (keyword) => {
            return keyword.relatedProducts.length >= constants.minimumAmountOfProductsMatched;
        });

        return filteredKeywords;
    });
};
