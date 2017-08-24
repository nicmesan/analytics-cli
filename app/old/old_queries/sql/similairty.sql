/* PRODUCT MATCHES -> PRODUCT MATCHES GROUPED */
INSERT INTO product_matches_grouped
SELECT p_concat.originalKeywordId,productMatchVector, p_concat.clientId, keywords.keywordValue from (SELECT *,
    (SELECT group_concat(productId ORDER BY pmx.productId ASC)
FROM product_matches pmx
WHERE pm.originalKeywordId = pmx.originalKeywordId
GROUP BY pmx.originalKeywordId) as productMatchVector
FROM product_matches pm) p_concat
INNER JOIN keywords
WHERE keywords.id = p_concat.originalKeywordId;
/*-------------------------------------------*/


/* PRODUCT MATCHES -> PRODUCT MATCHES GROUPED UNIQUE */
INSERT INTO product_matches_grouped_unique
(SELECT pmg.originalKeywordId, pmg.productMatchVector, pmg.clientId, pmg.keywordValue
FROM (select distinct * from product_matches_grouped) pmg
INNER JOIN
(SELECT productMatchVector, max(keywordValue) as maxkv FROM (select distinct * from product_matches_grouped) pmgu2
GROUP BY productMatchVector) pmgu
ON pmg.productMatchVector = pmgu.productMatchVector
AND pmg.keywordValue = pmgu.maxkv);

/* PRODUCT SIMILARITY FILTER QUERY */
INSERT INTO product_matches_similarity
SELECT originalKeywordId,
Count(*) AS matched_products,
    3 AS total_products,
    clientId
FROM   (SELECT * FROM product_matches WHERE originalKeywordId IN (SELECT originalKeywordId FROM product_matches_grouped_unique)) pmx
WHERE  pmx.productId IN (SELECT productId
FROM   product_matches
WHERE  originalKeywordId = 1519)
AND pmx.originalKeywordId != 1519
GROUP  BY originalKeywordId,clientId;

/* SIMILARITY -> FINAL CLASSES */
INSERT INTO product_matches_final_classes
(SELECT pms.originalKeywordId, ks.keywordValue, ks.clientId FROM product_matches_similarity pms
INNER JOIN keywords ks
ON pms.originalKeywordId = ks.id
WHERE cast(pms.matched_products/pms.total_products as decimal(5,4)) > 0.5
ORDER BY keywordValue DESC
LIMIT 1);