/*
  Warnings:

  - You are about to drop the `RhkAspekIndicator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RhkAspekIndicator" DROP CONSTRAINT "RhkAspekIndicator_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "RhkAspekIndicator" DROP CONSTRAINT "RhkAspekIndicator_rhkAspekId_fkey";

-- AlterTable
ALTER TABLE "RhkAspek" ADD COLUMN     "indicatorId" TEXT;

-- DropTable
DROP TABLE "RhkAspekIndicator";

-- AddForeignKey
ALTER TABLE "RhkAspek" ADD CONSTRAINT "RhkAspek_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
