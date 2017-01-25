// var Promise = require('bluebird');
// var saveKeywordsByPage = require('../save_keywords/saveKeywordsByPage').saveKeywordsByPage;
// var getKeywords = require('../save_keywords/saveKeywordsByPage').getKeywords;
// var Pages = require('../../collections/pages');
//
// exports.saveAllKeywords = function (req, res) {
//     var clientId = req.params.clientId;
//     Pages.collections.forge({clientId: clientId})
//         .fetch()
//         .then(function (pages) {
//             console.log('finished', pages.toJSON())
//             var savePages = pages.forEach(function (page) {
//                 saveKeywordsByPage(req, res, page.id, clientId)
//             });
//
//             Promise.all(savePages)
//                 .then(function () {
//                     return res.status(400).send({message: 'All keywords were saved'});
//                 })
//         })
// };