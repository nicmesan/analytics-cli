var Ksets = require('../../collections/kset');
var winston = require('winston');
var searchConsole = require('../../services/search-console');
var auth = require('../../services/oauth');
var knex = require('../../../config/knex');


exports.saveKeywords = function (req, res, next) {
    var pageId = req.body.pageId;
    var clientId = req.params.clientId;

    saveKeywordsByPage(pageId, clientId, next)
        .then(function (message) {
            console.log(message);
          if(message) {
            res.status(200).json({message: 'All pages have been saved successfully'})
          }
        })
};

function saveRows(rows) {
    return knex.transaction(function(trx) {
        knex.insert(rows)
            .into('ksets')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(function(error) {
        console.error(error);
    });
}


function saveKeywordsByPage (pageId, clientId, next) {
    if (!pageId || !clientId) {
        next({message: 'Include page size and client ID'})
    }

    else {
       return searchConsole.getPagePathByPageId(pageId)
               .then(function (pagePath) {
                   return searchConsole.getDomainByClientId(clientId)
                       .then(function (domain) {
                           var fullUrl = 'http://' + domain + pagePath;
                           var options = {
                               startRow: 1,
                               dimensions: ['query'],
                               filters: [ searchConsole.getFilter('page', 'equals', fullUrl) ]
                           };
                           return searchConsole.fetch(domain, options)
                               .then( function (data) {
                                   var dataToSave = data.rows;
                                   if (dataToSave) {
                                       winston.debug(data.rows.length + ' keywords fetched from page id ' + pageId );
                                       dataToSave.forEach(function(row) {
                                           row.keys = row.keys[0];
                                           row.pageId = pageId;
                                       });
                                       return saveRows(dataToSave);
                                   } else {
                                       //No keywords for that page
                                       return [];
                                   }

                               })
                       }, function (error) {
                           next({ message: 'Cannot find client domain in DB', error : error.message, code: 400 });
                       })
               }, function (error) {
                   next({ message: 'Cannot find page path in DB', error : error.message, code: 400 });
               })
               .catch(function (error) {
                   next({message: "Internal server error ", error: error.message, code: 400})
               })
    }
}

exports.getKeywords = saveKeywordsByPage;