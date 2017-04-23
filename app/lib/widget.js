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
    return knex.select('ksets.keys','target_ksets.fromUrl')
        .from('target_ksets').leftJoin('ksets', 'target_ksets.ksetId', 'ksets.id')
        .where('target_ksets.clientId','=', clientId)
        .orderBy(knex.raw('RAND()'))
        .limit(5);
}