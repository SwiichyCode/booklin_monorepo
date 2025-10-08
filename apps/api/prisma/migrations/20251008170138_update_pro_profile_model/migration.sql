/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `pro_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('ENTERPRISE_INFO', 'PROFESSIONAL_INFO', 'LOCATION', 'MEDIA', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "pro_profiles" ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "corporateName" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "legalForm" TEXT,
ADD COLUMN     "legalStatus" TEXT,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'ENTERPRISE_INFO',
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "siret" TEXT,
ADD COLUMN     "validationStatus" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "businessName" DROP NOT NULL,
ALTER COLUMN "profession" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pro_profiles_siret_key" ON "pro_profiles"("siret");
