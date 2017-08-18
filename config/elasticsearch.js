var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {
    hosts: [
        'http://javieranselmi:zapata12@192.168.99.100:9200/',
        'http://javieranselmi:zapata12@192.168.99.100:9200/'
    ]
});

module.exports = client;