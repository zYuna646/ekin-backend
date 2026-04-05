/*
  Warnings:

  - Added the required column `cascading` to the `Skp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `Skp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendekatan` to the `Skp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renstraId` to the `Skp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Skp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Skp" ADD COLUMN     "cascading" TEXT NOT NULL,
ADD COLUMN     "nip" TEXT NOT NULL,
ADD COLUMN     "pendekatan" TEXT NOT NULL,
ADD COLUMN     "renstraId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Skp" ADD CONSTRAINT "Skp_renstraId_fkey" FOREIGN KEY ("renstraId") REFERENCES "Renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
