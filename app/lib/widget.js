var errors = require('../errors');
var knex = require("../../config/knex.js");

exports.getKsetsForWidget = function (clientId) {

    return getTargetKsets(clientId)
        .then((ksets) => {

            let result = ksets.map((kset) => {
                return {anchorText: kset.keys, link: kset.fromUrl}
            });

            return result;
        })
};

function getTargetKsets (clientId) {
    return knex.select('keywords.keyword','target_keywords.fromUrl')
        .from('target_keywords').leftJoin('keywords', 'target_keywords.originalKeywordId', 'keywords.id')
        .where('target_keywords.clientId','=', clientId)
        .orderBy(knex.raw('RAND()'))
        .limit(5);
}