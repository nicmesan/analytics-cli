let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let Queue = require('promise-queue');
let baseEquivalenceQuery = require('../queries/insert-base-equivalence-classes');

//Private


/*

function registerBaseEquivalenceClasses() {
    winston.info("Registering base equivalence classes");
    return knex.raw(baseEquivalenceQuery)
        .then(function () {
            winston.info("Base equivalence classes where registered OK");
        }).catch(function (err) {
            winston.error("There was an error inserting base equivalence classes", err);
            throw Error("There was an error inserting base equivalence classes", err);
        });
};

function getUnprocessedEqClass() {
    return knex.select('*').top(1).from('product_match_equivalence_classes').where('processed','=','false')
        .then(function (result) {
        return result[0]
    });
}

function processNextUnprocessedEqClass(amountOfEquivalenceClasses) {
    return getUnprocessedEqClass.then(function(eqClass) {
        var promiseList = [];
        for (var i=0; i<=amountOfEquivalenceClasses; i++) {
            promiseList.push(compareEqClassWithNthEqClass(eqClass, i));
        }
    });
};

compareEqClassWithNthEqClass(eqClass, i) {
    return getNthUnprocessedClass(i).then(function(eqClassToCompare){
        return isEqClass
    })

}


function getAmountOfEquivalenceClasses() {
    return knex.select('count(*)').from('product_match_equivalence_classes').then(function (result) {
        return result[0]
    });
}

*/

function compareEqClassWithOthers(eqClass, amountOfOtherEqClasses) {
    var promiseList = [];

    for (var i = 0; i <amountOfOtherEqClasses, i++) {

    }
}

// n is the amount of records (classes) extracted on each select.
function compareWithAllOtherEqClasses(eqClass, n) {
    //Implement loop to compare with N other Eq Classes
}



//////CONDITIONAL PROMISE EACH//////////////////////

function conditionalPromiseEach(promiseList, condition) {
    var wrappedPromiseList = promiseList.map(function(promise) {
        promiseWrapperToRejectIfCondition(promiseList, condition)
    });

    return Promise.each()
        .catch(function(value) {
            return Promise.resolve(value);
        })
}
function promiseWrapperToRejectIfCondition(promise, condition) {
    return promise().then(function(value) {
        if (condition(value)) {
            return Promise.reject(value)
        }
        else {
            return Promise.resolve(value)
        }
    })
}
///////////////////////////////////////////////////


function compareWithNOtherEqClasses(n, offset, eqClass) {
    return getNOtherEqClass(n, offset).then((nthOtherClasses) => {
        getBestSimilarEqClass(eqClass, nthOtherClasses);
    });
}

function getBestSimilarEqClass(eqClass, nthOtherClasses) {
    var bestEqClass = eqClass;
    var i = 0;
    var foundBetterSimilarClass = false;

    while(!foundBetterSimilarClass) {
        var currentEvaluatedEqClass = nthOtherClasses[i];
        if (areClassesSimilar(eqClass, currentEvaluatedEqClass)
            && getBestEqClass(eqClass, currentEvaluatedEqClass) == currentEvaluatedEqClass) {
            bestEqClass = currentEvaluatedEqClass;
            foundBetterSimilarClass = true;
        }
        i++;
    }
    return bestEqClass;
};

function getNOtherEqClass(offset, n) {
    return knex.select()
        .from('product_match_equivalence_classes')
        .limit(n)
        .offset(offset)
        .where('processStatus', '!=', 'processing')
        .and('proocessStatus', '!=', 'processed');
}

function getBestEqClass(eqClass1, eqClass2) {
    return (eqClass1.keywordValue > eqClass2.keywordValue) ? eqClass1 : eqClass2;
};

function areClassesSimilar (eqClass1, eqClass2, similarityThreshold) {
    var products1 = eqClass1.matchedProducts.split(',');
    var products2 = eqClass2.matchedProducts.split(',');
    var intersectedElements = _.intersection(products1, products2);
    var smallestLength = Math.min(products1.length, products2.length);
    var similarity = intersectedElements.length / smallestLength;
    return (similarity >= similarityThreshold);
};



module.exports = function (clientId) {

    winston.info("Initiating keyord similarity filter");

    //Must return below promise once debugged and working.
    registerBaseEquivalenceClasses()
        .then(function () {
            return getAmountOfEquivalenceClasses()
        })
        .then(function (amountOfEquivalenceClasses) {

            while(!allEqClassesProcessed) {
                promiseList.push(processNextUnprocessedEqClass)
            }

        });

    return Promise.resolve(1); //Placeholder

};

