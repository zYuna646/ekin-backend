-- CreateTable
CREATE TABLE "Rhk" (
    "id" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "klasifikasi" TEXT NOT NULL,
    "penugasan" TEXT,
    "skpId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rhk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RhkRkt" (
    "id" TEXT NOT NULL,
    "rhkId" TEXT NOT NULL,
    "rktId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkRkt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RhkRelation" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RhkAspek" (
    "id" TEXT NOT NULL,
    "desc" TEXT,
    "jenis" TEXT NOT NULL,
    "rhkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkAspek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RhkAspekIndicator" (
    "id" TEXT NOT NULL,
    "rhkAspekId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RhkAspekIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RhkRelation_parentId_childId_key" ON "RhkRelation"("parentId", "childId");

-- AddForeignKey
ALTER TABLE "Rhk" ADD CONSTRAINT "Rhk_skpId_fkey" FOREIGN KEY ("skpId") REFERENCES "Skp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkRkt" ADD CONSTRAINT "RhkRkt_rhkId_fkey" FOREIGN KEY ("rhkId") REFERENCES "Rhk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkRkt" ADD CONSTRAINT "RhkRkt_rktId_fkey" FOREIGN KEY ("rktId") REFERENCES "Rkt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkRelation" ADD CONSTRAINT "RhkRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Rhk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkRelation" ADD CONSTRAINT "RhkRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Rhk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkAspek" ADD CONSTRAINT "RhkAspek_rhkId_fkey" FOREIGN KEY ("rhkId") REFERENCES "Rhk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkAspekIndicator" ADD CONSTRAINT "RhkAspekIndicator_rhkAspekId_fkey" FOREIGN KEY ("rhkAspekId") REFERENCES "RhkAspek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RhkAspekIndicator" ADD CONSTRAINT "RhkAspekIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
