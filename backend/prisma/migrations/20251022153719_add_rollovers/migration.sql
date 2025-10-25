-- CreateEnum
CREATE TYPE "RolloverStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "RolloverRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "approxBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxType" TEXT NOT NULL,
    "destType" TEXT NOT NULL,
    "destInstitution" TEXT,
    "destAccountLast4" TEXT,
    "legalName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "status" "RolloverStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolloverRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolloverFile" (
    "id" SERIAL NOT NULL,
    "rolloverId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolloverFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolloverRequest_userId_idx" ON "RolloverRequest"("userId");

-- CreateIndex
CREATE INDEX "RolloverFile_rolloverId_idx" ON "RolloverFile"("rolloverId");

-- AddForeignKey
ALTER TABLE "RolloverRequest" ADD CONSTRAINT "RolloverRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolloverFile" ADD CONSTRAINT "RolloverFile_rolloverId_fkey" FOREIGN KEY ("rolloverId") REFERENCES "RolloverRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
