-- Align the original exercise schema with the Capstone Brief without dropping data.
CREATE TYPE "Role" AS ENUM ('CLIENT', 'PROVIDER', 'ADMIN');

ALTER TABLE "provider_profiles" DROP CONSTRAINT "provider_profiles_user_id_fkey";
ALTER TABLE "services" DROP CONSTRAINT "services_provider_id_fkey";

DROP INDEX "provider_profiles_city_idx";
DROP INDEX "provider_profiles_user_id_key";
DROP INDEX "services_price_minor_idx";
DROP INDEX "services_provider_id_idx";
DROP INDEX "users_email_key";

ALTER TABLE "users" RENAME TO "User";
ALTER TABLE "provider_profiles" RENAME TO "ProviderProfile";
ALTER TABLE "services" RENAME TO "Service";

ALTER TABLE "User" RENAME CONSTRAINT "users_pkey" TO "User_pkey";
ALTER TABLE "ProviderProfile" RENAME CONSTRAINT "provider_profiles_pkey" TO "ProviderProfile_pkey";
ALTER TABLE "Service" RENAME CONSTRAINT "services_pkey" TO "Service_pkey";

ALTER TABLE "User" RENAME COLUMN "password_hash" TO "password";
ALTER TABLE "User" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "User" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "User" ADD COLUMN "first_name" TEXT;
ALTER TABLE "User" ADD COLUMN "last_name" TEXT;
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'CLIENT';
ALTER TABLE "User" ADD COLUMN "has_validated_email" BOOLEAN NOT NULL DEFAULT false;
UPDATE "User"
SET "first_name" = split_part(trim("name"), ' ', 1),
    "last_name" = CASE
      WHEN position(' ' IN trim("name")) > 0
      THEN substring(trim("name") FROM position(' ' IN trim("name")) + 1)
      ELSE ''
    END;
ALTER TABLE "User" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "last_name" SET NOT NULL;
ALTER TABLE "User" DROP COLUMN "name";

ALTER TABLE "ProviderProfile" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "ProviderProfile" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "ProviderProfile" ADD COLUMN "hourly_rate_minor" INTEGER;
ALTER TABLE "ProviderProfile" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'NGN';
ALTER TABLE "ProviderProfile" ADD COLUMN "avatar_url" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "id_document_url" TEXT;
UPDATE "User" u
SET "role" = 'PROVIDER'
FROM "ProviderProfile" pp
WHERE pp."userId" = u.id;
ALTER TABLE "ProviderProfile" DROP COLUMN "created_at";
ALTER TABLE "ProviderProfile" DROP COLUMN "updated_at";

ALTER TABLE "Service" RENAME COLUMN "provider_id" TO "providerId";
ALTER TABLE "Service" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Service" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Service" DROP COLUMN "category";
ALTER TABLE "Service" DROP COLUMN "updated_at";

ALTER TABLE "User" ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT;
ALTER TABLE "ProviderProfile" ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT;
ALTER TABLE "ProviderProfile" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
ALTER TABLE "Service" ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT;
ALTER TABLE "Service" ALTER COLUMN "providerId" TYPE TEXT USING "providerId"::TEXT;

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "ProviderProfile" ALTER COLUMN "category" DROP DEFAULT;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");
CREATE INDEX "ProviderProfile_category_city_idx" ON "ProviderProfile"("category", "city");

ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey"
  FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
