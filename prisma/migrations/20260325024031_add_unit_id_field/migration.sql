/*
  Warnings:

  - Added the required column `unitId` to the `Kegiatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `SubKegiatan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kegiatan" ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubKegiatan" ADD COLUMN     "unitId" TEXT NOT NULL;
