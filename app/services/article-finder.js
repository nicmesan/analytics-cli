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
        _source: false,
        min_score: constants.minimumScoreForArticleMatching,
        query: {
            match: {
                description: keyword.keyword
            }
        }
    }
}

exports.getArticlesFromKeywords = function (keywords, clientKey) {
    var bodies = _.map(keywords, (keyword) => {
        return formatForSearch(keyword);
    });
    return elasticsearch.bulkQuery(clientKey, 'products', bodies).then((results) => {
        _.each(results.responses, (response, index) => {
            let relatedArticleIds = _.map(response.hits.hits, (hit) => {
                return hit["_id"];
            });
            keywords[index].relatedArticles = relatedArticleIds;

        });

        let filteredKeywords = _.filter(keywords, (keyword) => {
            return keyword.relatedArticles.length >= constants.minimumAmountOfArticlesMatched;
        });

        return filteredKeywords;
    });
};
