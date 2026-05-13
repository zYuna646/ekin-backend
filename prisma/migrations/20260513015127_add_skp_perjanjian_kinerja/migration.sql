-- CreateTable
CREATE TABLE "SkpPerjanjianKinerja" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "skpId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkpPerjanjianKinerja_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkpPerjanjianKinerja" ADD CONSTRAINT "SkpPerjanjianKinerja_skpId_fkey" FOREIGN KEY ("skpId") REFERENCES "Skp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
