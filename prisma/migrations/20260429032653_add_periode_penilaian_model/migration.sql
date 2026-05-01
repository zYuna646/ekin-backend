-- AlterTable
ALTER TABLE "Skp" ADD COLUMN     "isJPT" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PeriodePenilaian" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodePenilaian_pkey" PRIMARY KEY ("id")
);
