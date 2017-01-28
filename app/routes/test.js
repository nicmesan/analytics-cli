var Promise = require('bluebird')

exports.test = function (req, res, next) {
        return aaa()
        .then(function(data) {
           return 1
        })
        .then(function(data){
            res.send(2) ;
        })
}

function aaa () {
    return Promise.resolve(function() {
        return 1
    })
}
