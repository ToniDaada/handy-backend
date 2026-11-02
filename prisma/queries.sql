-- Providers in Lagos
SELECT pp.*, u.first_name, u.last_name, u.email
FROM "ProviderProfile" AS pp
JOIN "User" AS u ON u.id = pp."userId"
WHERE LOWER(pp.city) = LOWER('Lagos');

-- Services under N10,000 (prices are stored in kobo)
SELECT *
FROM "Service"
WHERE price_minor < 1000000
ORDER BY price_minor ASC;

-- Service count per provider (including providers with no services)
SELECT pp.id, u.first_name, u.last_name, COUNT(s.id) AS service_count
FROM "ProviderProfile" AS pp
JOIN "User" AS u ON u.id = pp."userId"
LEFT JOIN "Service" AS s ON s."providerId" = pp.id
GROUP BY pp.id, u.first_name, u.last_name
ORDER BY service_count DESC, u.first_name ASC, u.last_name ASC;
