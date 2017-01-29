var oauth = require('../services/oauth');
var setCredentials =  function (req, res, next) {
  console.log('MIDDLEWARE AUTH HIT');
  var clientId = req.params.clientId;
  console.log(req.params)
console.log(clientId)

  oauth.setExistingCredentials(clientId)
      .then(function () {
          next()
      }, function (error) {
          next(error);
      })
};

module.exports = setCredentials;