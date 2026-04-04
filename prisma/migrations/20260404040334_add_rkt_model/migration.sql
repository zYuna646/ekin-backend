-- CreateTable
CREATE TABLE "Rkt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "totalAnggaran" DOUBLE PRECISION NOT NULL,
    "renstraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rkt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RktSubKegiatan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "totalAnggaran" DOUBLE PRECISION NOT NULL,
    "rktId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RktSubKegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RktInputIndicator" (
    "id" TEXT NOT NULL,
    "rktId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RktInputIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RktOutputIndicator" (
    "id" TEXT NOT NULL,
    "rktId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RktOutputIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RktOutcomeIndicator" (
    "id" TEXT NOT NULL,
    "rktId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RktOutcomeIndicator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rkt" ADD CONSTRAINT "Rkt_renstraId_fkey" FOREIGN KEY ("renstraId") REFERENCES "Renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktSubKegiatan" ADD CONSTRAINT "RktSubKegiatan_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktInputIndicator" ADD CONSTRAINT "RktInputIndicator_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktInputIndicator" ADD CONSTRAINT "RktInputIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktOutputIndicator" ADD CONSTRAINT "RktOutputIndicator_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktOutputIndicator" ADD CONSTRAINT "RktOutputIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktOutcomeIndicator" ADD CONSTRAINT "RktOutcomeIndicator_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RktOutcomeIndicator" ADD CONSTRAINT "RktOutcomeIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
