/*
  Warnings:

  - You are about to drop the `RhkRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RhkRelation" DROP CONSTRAINT "RhkRelation_childId_fkey";

-- DropForeignKey
ALTER TABLE "RhkRelation" DROP CONSTRAINT "RhkRelation_parentId_fkey";

-- AlterTable
ALTER TABLE "Rhk" ADD COLUMN     "parentRhkId" TEXT;

-- DropTable
DROP TABLE "RhkRelation";

-- AddForeignKey
ALTER TABLE "Rhk" ADD CONSTRAINT "Rhk_parentRhkId_fkey" FOREIGN KEY ("parentRhkId") REFERENCES "Rhk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
