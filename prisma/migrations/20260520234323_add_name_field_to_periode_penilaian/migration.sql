/*
  Warnings:

  - Added the required column `name` to the `PeriodePenilaian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PeriodePenilaian" ADD COLUMN     "name" TEXT NOT NULL;
