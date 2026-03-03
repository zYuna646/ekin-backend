/*
  Warnings:

  - Added the required column `unitId` to the `Renstra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Renstra" ADD COLUMN     "unitId" TEXT NOT NULL;
