module.exports = function (req, res, next) {
    res.status(200).json({message: "Client data was saved"});
};
