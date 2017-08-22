var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {
    hosts: [
        'https://search-tarantula-f3mxx6bnfmiwjumonropmqtebu.us-east-1.es.amazonaws.com',
        'https://search-tarantula-f3mxx6bnfmiwjumonropmqtebu.us-east-1.es.amazonaws.com'
    ]
});

module.exports = client;