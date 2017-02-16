function getUser(req, res, next) {
    return getInteralUser().then(function(result) {
        res.status(200).json(result);
    })
        .catch(function(err){
            res.status(500).json(err.message);
        })
}





function getInteralUser() {

    return Promise.resolve(5)
    .then(function (result) {
        return result + 5;
    })
    .catch(function (error) {
        throw Error("La pija fallo")
    })
    .then(function (result2) {
        return result2 + 10;
    })
    .catch(function (error) {
        throw Error("La chota fallo")
    })
    .catch(function (error) {
        //throw Error("La chota fallo")
        throw error;
    })
}

module.exports = {getUser: getUser};