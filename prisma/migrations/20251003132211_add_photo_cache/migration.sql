-- CreateTable
CREATE TABLE "PhotoCache" (
    "photoId" INTEGER NOT NULL,
    "roverId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoSol" INTEGER NOT NULL,
    "photoEarthDate" TEXT NOT NULL,
    "cameraName" TEXT NOT NULL,
    "cameraFullName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoCache_pkey" PRIMARY KEY ("photoId")
);

-- CreateIndex
CREATE INDEX "PhotoCache_photoId_idx" ON "PhotoCache"("photoId");
