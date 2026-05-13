-- CreateTable
CREATE TABLE "PimpinanUnitKerja" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitKerjaId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "nip" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PimpinanUnitKerja_pkey" PRIMARY KEY ("id")
);
