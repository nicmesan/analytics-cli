var Promise = require('bluebird')

exports.test = function (req, res, next) {
        Promise.resolve('asd')
        .then(function(data) {
           return 1
                .then(function(data){
                    return Promise.reject();
                }, function(error) {
                    next('error 1')
                })
        }, function(error) {
            next('error 2')
    })
    .catch(function (error){
        next('error catched')
    })
}

function aaa () {
    return Promise.resolve(function() {
        return 1
    })
}
