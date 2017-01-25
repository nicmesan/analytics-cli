var Ksets = require('../../collections/kset');
var searchConsole = require('../../services/search-console');
var auth = require('../../services/oauth');


exports.saveKeywords = function (req, res, next) {
    var pageId = req.body.pageId;
    var clientId = req.params.clientId;

    saveKeywordsByPage(pageId, clientId, next)
        .then(function (message) {
            res.status(200).json(message)
        })
};


function saveKeywordsByPage (pageId, clientId, next) {

    if (!pageId || !clientId) {
        next({message: 'Include page size and client ID'})
    }

    else {
       return searchConsole.getPagePathByPageId(pageId)
               .then(function (pagePath) {
                   return searchConsole.getDomainByClientId(clientId)
                       .then(function (domain) {
                           return auth.setExistingCredentials(clientId)
                               .then(function () {
                                   var fullUrl = 'http://' + domain + pagePath;
                                   var options = {
                                       startRow: 1,
                                       dimensions: ['query'],
                                       filters: [ searchConsole.getFilter('page', 'equals', fullUrl) ]
                                   };
                                   return searchConsole.fetch(domain, options)
                                       .then( function (data) {
                                           var dataToSave = data.rows;
                                           if (!dataToSave) {
                                               next('Client has 0 keywords for that page');
                                           }
                                           else {
                                               dataToSave.forEach(function(row) {
                                                   row.keys = row.keys[0];
                                                   row.pageId = pageId;
                                               });
                                               var keywordsToSave = Ksets.collections.forge(dataToSave);
                                               keywordsToSave.invokeThen('save', null)
                                                   .then(function() {
                                                       return 'All keywords have been saved';
                                                   }, function (error) {
                                                       next({ message: 'Data could not be saved in the DB', error : error });
                                                   });
                                           }

                                       })
                               }, function (error) {
                                   next({message: "Credentials could'nt be set", error: error})
                               })
                       }, function (error) {
                           next({ message: 'Cannot find client domain in DB', error : error });
                       })
               }, function (error) {
                   next('Cannot find page path in DB');
               })
               .catch(function (error) {
                   next({message: "Internal server error ", error: error})
               })
    }
}