exports.replaceStrategy = function (keyword, options) {
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';

    return (prefix + (keyword.keyword.split(' ').join(options.separator)) + suffix);
};

exports.defaultStrategy = function (kset) {
    return this.replaceStrategy(kset,{separator: '-'});
};

