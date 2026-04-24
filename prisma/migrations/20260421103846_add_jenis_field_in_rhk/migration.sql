/*
  Warnings:

  - Added the required column `jenis` to the `Rhk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rhk" ADD COLUMN     "jenis" TEXT NOT NULL;
