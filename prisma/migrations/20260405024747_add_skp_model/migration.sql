-- CreateTable
CREATE TABLE "Skp" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT[],
    "jabatan" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkpRelation" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkpRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkpLampiran" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT[],
    "skpId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkpLampiran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkpRelation_parentId_childId_key" ON "SkpRelation"("parentId", "childId");

-- AddForeignKey
ALTER TABLE "SkpRelation" ADD CONSTRAINT "SkpRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Skp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkpRelation" ADD CONSTRAINT "SkpRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Skp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkpLampiran" ADD CONSTRAINT "SkpLampiran_skpId_fkey" FOREIGN KEY ("skpId") REFERENCES "Skp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
