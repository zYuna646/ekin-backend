-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAnggaran" DOUBLE PRECISION NOT NULL,
    "programId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubKegiatan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAnggaran" DOUBLE PRECISION NOT NULL,
    "kegiatanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubKegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KegiatanIndicator" (
    "id" TEXT NOT NULL,
    "kegiatanId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KegiatanIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubKegiatanIndicator" (
    "id" TEXT NOT NULL,
    "subKegiatanId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubKegiatanIndicator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kegiatan" ADD CONSTRAINT "Kegiatan_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubKegiatan" ADD CONSTRAINT "SubKegiatan_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "Kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KegiatanIndicator" ADD CONSTRAINT "KegiatanIndicator_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "Kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KegiatanIndicator" ADD CONSTRAINT "KegiatanIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubKegiatanIndicator" ADD CONSTRAINT "SubKegiatanIndicator_subKegiatanId_fkey" FOREIGN KEY ("subKegiatanId") REFERENCES "SubKegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubKegiatanIndicator" ADD CONSTRAINT "SubKegiatanIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
