/*
  Warnings:

  - You are about to drop the column `name` on the `RktSubKegiatan` table. All the data in the column will be lost.
  - You are about to drop the column `totalAnggaran` on the `RktSubKegiatan` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `RktSubKegiatan` table. All the data in the column will be lost.
  - Added the required column `subKegiatanId` to the `RktSubKegiatan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RktSubKegiatan" DROP COLUMN "name",
DROP COLUMN "totalAnggaran",
DROP COLUMN "unitId",
ADD COLUMN     "subKegiatanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RktSubKegiatan" ADD CONSTRAINT "RktSubKegiatan_subKegiatanId_fkey" FOREIGN KEY ("subKegiatanId") REFERENCES "SubKegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
