/*
  Warnings:

  - You are about to drop the `RhkRkt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RhkRkt" DROP CONSTRAINT "RhkRkt_rhkId_fkey";

-- DropForeignKey
ALTER TABLE "RhkRkt" DROP CONSTRAINT "RhkRkt_rktId_fkey";

-- AlterTable
ALTER TABLE "Rhk" ADD COLUMN     "rktId" TEXT;

-- DropTable
DROP TABLE "RhkRkt";

-- AddForeignKey
ALTER TABLE "Rhk" ADD CONSTRAINT "Rhk_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
