validator = require('../utils/required-parameter-validator');

module.exports = function (req, res, next) {
    validator.validateRequiredParameters({name: null, sirname: null});
    res.status(200).json({message: "Client data was saved"});
};
