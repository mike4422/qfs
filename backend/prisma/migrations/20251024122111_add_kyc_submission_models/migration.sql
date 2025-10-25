/*
  Warnings:

  - You are about to drop the column `userId` on the `KycFile` table. All the data in the column will be lost.
  - Added the required column `kind` to the `KycFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `KycFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KycFile" DROP CONSTRAINT "KycFile_userId_fkey";

-- DropIndex
DROP INDEX "KycFile_userId_idx";

-- AlterTable
ALTER TABLE "KycFile" DROP COLUMN "userId",
ADD COLUMN     "kind" TEXT NOT NULL,
ADD COLUMN     "submissionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "KycSubmission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "country" TEXT,
    "docType" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "dob" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KycSubmission_userId_idx" ON "KycSubmission"("userId");

-- CreateIndex
CREATE INDEX "KycFile_submissionId_idx" ON "KycFile"("submissionId");

-- AddForeignKey
ALTER TABLE "KycSubmission" ADD CONSTRAINT "KycSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycFile" ADD CONSTRAINT "KycFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "KycSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
