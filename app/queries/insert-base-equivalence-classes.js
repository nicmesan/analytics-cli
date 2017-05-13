module.exports = 'INSERT INTO product_match_equivalence_classes (originalKeywordId,matchedProducts, keywordValue) (SELECT ks.originalKeywordId, ks.matchedProducts, ks.keywordValue FROM (SELECT grouped_keywords.originalKeywordId, grouped_keywords.matchedProducts, keywords.* FROM (SELECT originalKeywordId, GROUP_CONCAT(productId ORDER BY productId ASC SEPARATOR \',\') as matchedProducts FROM business_filtered_keywords_products GROUP BY originalKeywordId ORDER BY matchedProducts DESC) grouped_keywords INNER JOIN keywords ON grouped_keywords.originalKeywordId = keywords.id) ks INNER JOIN (SELECT matchedProducts, max(keywordValue) AS maxKV FROM (SELECT grouped_keywords.originalKeywordId, grouped_keywords.matchedProducts, keywords.* FROM  (SELECT originalKeywordId, GROUP_CONCAT(productId ORDER BY productId ASC SEPARATOR \',\')  as matchedProductsFROM business_filtered_keywords_products GROUP BY originalKeywordId ORDER BY matchedProducts DESC) grouped_keywordsINNER JOIN keywords ON grouped_keywords.originalKeywordId = keywords.id) grouped_keywords GROUP BY matchedProducts) group_ks ON ks.matchedProducts = group_ks.matchedProducts AND ks.keywordValue = group_ks.maxKV)'