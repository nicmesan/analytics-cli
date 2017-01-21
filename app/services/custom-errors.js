var Promise = require('bluebird');

function SetExistingCredentials(message){
    this.message = message;
}

SetExistingCredentials.prototype = Object.create(Promise.OperationalError.prototype);

function GetViewIdByClientId(message){
    this.message = message;
}

GetViewIdByClientId.prototype = Object.create(Promise.OperationalError.prototype);

exports.SetExistingCredentials = SetExistingCredentials;
exports.GetViewIdByClientId = GetViewIdByClientId;