-- CreateEnum
CREATE TYPE "PhotoshootStatus" AS ENUM ('DRAFT', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Photoshoot" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productImageUrl" TEXT NOT NULL,
    "productImageNoBackground" TEXT,
    "status" "PhotoshootStatus" NOT NULL DEFAULT 'DRAFT',
    "creditCost" INTEGER NOT NULL DEFAULT 10,
    "selectedVariantIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Photoshoot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoshootVariant" (
    "id" TEXT NOT NULL,
    "photoshootId" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoshootVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photoshoot_brandId_idx" ON "Photoshoot"("brandId");

-- CreateIndex
CREATE INDEX "Photoshoot_status_idx" ON "Photoshoot"("status");

-- CreateIndex
CREATE INDEX "PhotoshootVariant_photoshootId_idx" ON "PhotoshootVariant"("photoshootId");

-- AddForeignKey
ALTER TABLE "Photoshoot" ADD CONSTRAINT "Photoshoot_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoshootVariant" ADD CONSTRAINT "PhotoshootVariant_photoshootId_fkey" FOREIGN KEY ("photoshootId") REFERENCES "Photoshoot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
