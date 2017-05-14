let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let Queue = require('promise-queue');
let baseEquivalenceQuery = require('../queries/insert-base-equivalence-classes');
let _ = require('lodash');

//Private

/*

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


// n is the amount of records (classes) extracted on each select.

function compareWithAllOtherEqClasses(eqClass, n, numberOfOtherEqClasses) {

    console.log('eqClass', eqClass);
    console.log('n', n);
    console.log('numberOfOtherEqClasses', numberOfOtherEqClasses);

    var numberOfBatches = Math.ceil(numberOfOtherEqClasses / n);
    var batchComparisons = [];

    var betterClass = compareWithNOtherEqClasses(numberOfOtherEqClasses, 0, eqClass);

    console.log('FINALLY for equivalence class i found a better similar eq class: ', betterClass)

    return betterClass;
    /*
    for(var i=0; i<numberOfBatches; i++) {
        batchComparisons.push(_.partial(compareWithNOtherEqClasses, n, i * n, eqClass));
    };

    console.log('calculated number of batches', numberOfBatches);
    console.log('batch comparisons vector', batchComparisons);

    return conditionalPromiseEach(batchComparisons, function (newBestEqClass) {
        eqClass != newBestEqClass;
    }).then(function(value){
        console.log(value);
    });*/
}

//////CONDITIONAL PROMISE EACH//////////////////////
function conditionalPromiseEach(promiseList, condition) {

    console.log('promiseList vector', promiseList);
    console.log('condition', condition);

    var wrappedPromiseList = promiseList.map(function(promise) {
        promiseWrapperToRejectIfCondition(promise, condition)
    });

    return Promise.each(wrappedPromiseList)
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

    console.log('Initiating compare with N other classes');
    console.log('n', n);
    console.log('offset', offset);
    console.log('eqClass', eqClass);

    return getNOtherEqClass(n, offset).then(function(nthOtherClasses) {
        console.log('finished: got nthOtherClasses length', nthOtherClasses.length);
        console.log('about to get Best Similar Eq Class');
        getBestSimilarEqClass(eqClass, nthOtherClasses);
    });
}

function getBestSimilarEqClass(eqClass, nthOtherClasses) {
    var bestEqClass = eqClass;
    var i = 0;
    var foundBetterSimilarClass = false;

    while(!foundBetterSimilarClass) {

        var currentEvaluatedEqClass = nthOtherClasses[i];
        console.log('Starting to evaluate the processing eqClass', eqClass.matchedProducts, 'with otherClass', currentEvaluatedEqClass.matchedProducts);

        console.log('are those classes similar?: ', areClassesSimilar(eqClass, currentEvaluatedEqClass, 0.8));
        console.log('get best equivalence class: ', getBestEqClass(eqClass, currentEvaluatedEqClass));
        console.log('is the best class the current equivalence class?', getBestEqClass(eqClass, currentEvaluatedEqClass) == currentEvaluatedEqClass);

        if (areClassesSimilar(eqClass, currentEvaluatedEqClass, 0.8)
            && getBestEqClass(eqClass, currentEvaluatedEqClass) == currentEvaluatedEqClass) {
            bestEqClass = currentEvaluatedEqClass;
            foundBetterSimilarClass = true;
            console.log('Found a better class:', bestEqClass);
        }
        i++;

    }
    return bestEqClass;
};

function getNOtherEqClass(n, offset) {

    console.log('getting nthOtherClasses');

    return knex.select()
        .from('product_match_equivalence_classes')
        .limit(n)
        .offset(offset)
        .whereNot('processStatus', 'processing')
        .andWhereNot('processStatus', 'processed')
        .tap(function(nthOtherClasses) {
            console.log('got nthOtherClasses', nthOtherClasses.length);
        })
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

    console.log('similarity', similarity);
    return (similarity >= similarityThreshold);
};

function getFirstEquivalenceClass() {
    return knex.select('*')
        .from('product_match_equivalence_classes')
        .limit(1)
        .whereNot('processStatus', 'processing')
        .andWhereNot('processStatus', 'processed')
        .tap(function(eqClass) {
            console.log('eqClass', eqClass);
            return knex('product_match_equivalence_classes')
                .where('id', '=', eqClass[0].id)
                .update('processStatus', 'processing');
        })
        .then(function (result) {
            return result[0];
        });
}

function amountOfEquivalenceClasses() {
    return knex('product_match_equivalence_classes')
        .count('id')
        .whereNot('processStatus', 'processing')
        .andWhereNot('processStatus', 'processed').
        then((result) => {
            console.log('count result', result[0]);
            return result[0]['count(\`id\`)']
        })
}

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

module.exports = function (clientId) {

    winston.info("Initiating keyword similarity filter");

    var parameters = {
        firstEquivalenceClassObj: getFirstEquivalenceClass(),
        amountOfEquivalenceClassesObj: amountOfEquivalenceClasses()
    };

    //Must return below promise once debugged and working.
    return registerBaseEquivalenceClasses()
        .then(function () {
            return Promise.props(parameters).then(function(result) {
                console.log('firstEquivalenceClassObj', result.firstEquivalenceClassObj);
                console.log('amountOfEquivalenceClassesObj', result.amountOfEquivalenceClassesObj);

                return compareWithAllOtherEqClasses(result.firstEquivalenceClassObj, 5, result.amountOfEquivalenceClassesObj)
            });
        })
        .then(function () {
            console.log('finished! OHMYGOTTHATWASLONG! FUCK!')
        });

    //return Promise.resolve(1); //Placeholder

};

