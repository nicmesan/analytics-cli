exports.replaceStrategy = function (kset, options) {
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';

    return (prefix + (kset.keys.split(' ').join(options.separator)) + suffix);
};

exports.defaultStrategy = function (kset) {
    return this.replaceStrategy(kset,{separator: '-'});
};

