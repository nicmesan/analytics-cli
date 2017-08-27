module.exports = Object.freeze({

    //BUSINESS
    minSearchResultsFilter: 1,
    maxRankingFactor: 5,
    similarityThreshold: 0.5,
    minimumScoreForArticleMatching: 10,
    minimumAmountOfArticlesMatched: 8,

    //TECHNICAL
    delayBetweenEachGoogleQueryBatch: 1500,
    maxElasticSingleQuerySize: 500
});

