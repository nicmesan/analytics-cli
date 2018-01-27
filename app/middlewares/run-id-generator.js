
module.exports = function runIdGenerator(req, res, next) {
    req.context.runId = new Date().getTime();
    next();
};
