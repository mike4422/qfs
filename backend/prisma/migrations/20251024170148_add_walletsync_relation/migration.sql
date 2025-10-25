-- CreateTable
CREATE TABLE "WalletSync" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletSync_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletSync" ADD CONSTRAINT "WalletSync_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
