/*
  Warnings:

  - You are about to drop the column `rktId` on the `Rhk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rhk" DROP CONSTRAINT "Rhk_rktId_fkey";

-- AlterTable
ALTER TABLE "Rhk" DROP COLUMN "rktId";

-- CreateTable
CREATE TABLE "RhkRkt" (
    "id" TEXT NOT NULL,
    "rhkId" TEXT NOT NULL,
    "rktId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkRkt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RhkRkt" ADD CONSTRAINT "RhkRkt_rhkId_fkey" FOREIGN KEY ("rhkId") REFERENCES "Rhk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkRkt" ADD CONSTRAINT "RhkRkt_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
