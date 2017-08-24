let BUSSINESS = require('../bussiness_contants');

exports.getKeywordBusinessValue = function (position, impressions) {
    let businessValue;
    let maxPosition = BUSSINESS.maxPosition || 5;

    if (position <= maxPosition) {
        businessValue = -1;
    }

    else if (position <= 10) {
        businessValue = 0.1 * impressions;
    }

    else if (position <= 20) {
        businessValue = 100 * impressions;
    }

    else if (position <= 30) {
        businessValue = 10 * impressions;
    }

    else if (position <= 40) {
        businessValue = 1 * impressions;
    }

    else {
        businessValue = 0.1 * impressions;
    }

    return businessValue;
};