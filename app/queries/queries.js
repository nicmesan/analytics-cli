//var matchesToMatchesGrouped = ' INSERT INTO product_matches_grouped' +
//' SELECT p_concat.originalKeywordId,productMatchVector, p_concat.clientId, keywords.keywordValue from (SELECT *,' +
//'   (SELECT group_concat(productId ORDER BY pmx.productId ASC)' +
//'    FROM product_matches pmx' +
//'    WHERE pm.originalKeywordId = pmx.originalKeywordId' +
//'    GROUP BY pmx.originalKeywordId) as productMatchVector' +
//' FROM product_matches pm) p_concat' +
//'   INNER JOIN keywords' +
//'   WHERE keywords.id = p_concat.originalKeywordId';
//
//var matchesGroupedToMatchesGroupedUnique = ' INSERT INTO product_matches_grouped_unique' +
//'   (SELECT pmg.originalKeywordId, pmg.productMatchVector, pmg.clientId, pmg.keywordValue' +
//' FROM (select distinct * from product_matches_grouped) pmg' +
//'   INNER JOIN' +
//'   (SELECT productMatchVector, max(keywordValue) as maxkv FROM (select distinct * from product_matches_grouped) pmgu2' +
//' GROUP BY productMatchVector) pmgu' +
//' ON pmg.productMatchVector = pmgu.productMatchVector' +
//' AND pmg.keywordValue = pmgu.maxkv)';
//
//var similarityFilter = ' INSERT INTO product_matches_similarity' +
//' SELECT originalKeywordId,' +
//'        Count(*) AS matched_products,' +
//'        3 AS total_products,' +
//'        clientId' +
//' FROM   (SELECT * FROM product_matches WHERE originalKeywordId IN (SELECT originalKeywordId FROM product_matches_grouped_unique)) pmx' +
//' WHERE  pmx.productId IN (SELECT productId' +
//'                           FROM   product_matches' +
//'                           WHERE  originalKeywordId = 1519)' +
//'        AND pmx.originalKeywordId != 1519' +
//' GROUP  BY originalKeywordId,clientId';
//
//var similarityFinalClassesInsert = ' INSERT INTO product_matches_final_classes' +
//' (SELECT pms.originalKeywordId, ks.keywordValue, ks.clientId FROM product_matches_similarity pms' +
//' INNER JOIN keywords ks' +
//' ON pms.originalKeywordId = ks.id' +
//' WHERE cast(pms.matched_products/pms.total_products as decimal(5,4)) > 0.5' +
//' ORDER BY keywordValue DESC' +
//' LIMIT 1)';

var queries = {};

queries.matchesToMatchesGrouped = 'INSERT INTO product_matches_grouped SELECT p_concat.originalKeywordId,productMatchVector, p_concat.clientId, keywords.keywordValue from (SELECT *,     (SELECT group_concat(productId ORDER BY pmx.productId ASC) FROM product_matches pmx WHERE pm.originalKeywordId = pmx.originalKeywordId GROUP BY pmx.originalKeywordId) as productMatchVector FROM product_matches pm) p_concat INNER JOIN keywords WHERE keywords.id = p_concat.originalKeywordId';
queries.matchesGroupedToMatchesGroupedUnique = 'INSERT INTO product_matches_grouped_unique (SELECT pmg.originalKeywordId, pmg.productMatchVector, pmg.clientId, pmg.keywordValue FROM (select distinct * from product_matches_grouped) pmg INNER JOIN (SELECT productMatchVector, max(keywordValue) as maxkv FROM (select distinct * from product_matches_grouped) pmgu2 GROUP BY productMatchVector) pmgu ON pmg.productMatchVector = pmgu.productMatchVector AND pmg.keywordValue = pmgu.maxkv)';
queries.similarityFilter = 'INSERT INTO product_matches_similarity SELECT originalKeywordId, Count(*) AS matched_products, ? AS total_products,     clientId FROM   (SELECT * FROM product_matches WHERE originalKeywordId IN (SELECT originalKeywordId FROM product_matches_grouped_unique)) pmx WHERE  pmx.productId IN (SELECT productId FROM   product_matches WHERE  originalKeywordId = ?) GROUP  BY originalKeywordId,clientId';
queries.similarityFinalClassesInsert = 'INSERT INTO product_matches_final_classes (SELECT pms.originalKeywordId, ks.keywordValue, ks.keyword, ks.clientId FROM product_matches_similarity pms INNER JOIN keywords ks ON pms.originalKeywordId = ks.id WHERE cast(pms.matched_products/pms.total_products as decimal(5,4)) > ? ORDER BY keywordValue DESC LIMIT 1);';
queries.deleteFromGroupedUnique = 'DELETE FROM product_matches_grouped_unique WHERE originalKeywordId IN (SELECT originalKeywordId FROM product_matches_similarity pms INNER JOIN keywords ks ON pms.originalKeywordId = ks.id WHERE cast(pms.matched_products/pms.total_products as decimal(5,4)) > ?)';
module.exports = queries;