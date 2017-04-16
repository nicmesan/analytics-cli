function getKeySetValue (keySetPosition, keySetImpressions, maxPosition) {
    var keySetValue;

    if (keySetPosition <= maxPosition) {
        keySetValue = -1;
    }

    else if (keySetPosition <= 10) {
        keySetValue = 0.1 * keySetImpressions;
    }

    else if (keySetPosition <= 20) {
        keySetValue = 100 * keySetImpressions;
    }

    else if (keySetPosition <= 30) {
        keySetValue = 10 * keySetImpressions;
    }

    else if (keySetPosition <= 40) {
        keySetValue = 1 * keySetImpressions;
    }

    else {
        keySetValue = 0.1 * keySetImpressions;
    }

    return keySetValue;
}

exports.addKeySetValue = function (keySetData, maxPosition) {

    maxPosition = maxPosition || 5;

    keySetData.keySetValue = getKeySetValue(keySetData.position, keySetData.impressions, maxPosition )
};