-- CreateTable
CREATE TABLE "KycFile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KycFile_userId_idx" ON "KycFile"("userId");

-- AddForeignKey
ALTER TABLE "KycFile" ADD CONSTRAINT "KycFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
