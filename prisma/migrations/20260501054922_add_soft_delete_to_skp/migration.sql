-- AlterTable
ALTER TABLE "Skp" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RhkPeriodePenilaian" (
    "id" TEXT NOT NULL,
    "skpId" TEXT NOT NULL,
    "rhkId" TEXT NOT NULL,
    "periodePenilaianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkPeriodePenilaian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RhkPeriodePenilaian" ADD CONSTRAINT "RhkPeriodePenilaian_skpId_fkey" FOREIGN KEY ("skpId") REFERENCES "Skp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkPeriodePenilaian" ADD CONSTRAINT "RhkPeriodePenilaian_rhkId_fkey" FOREIGN KEY ("rhkId") REFERENCES "Rhk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkPeriodePenilaian" ADD CONSTRAINT "RhkPeriodePenilaian_periodePenilaianId_fkey" FOREIGN KEY ("periodePenilaianId") REFERENCES "PeriodePenilaian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
