/*
  Warnings:

  - You are about to alter the column `amount` on the `Holding` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(36,18)`.
  - Added the required column `updatedAt` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING_REVIEW', 'QUEUED', 'BROADCASTING', 'CONFIRMED', 'FAILED', 'CANCELED');

-- DropIndex
DROP INDEX "Holding_userId_idx";

-- DropIndex
DROP INDEX "Holding_userId_symbol_key";

-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "locked" DECIMAL(36,18) NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(36,18);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "amount" DECIMAL(36,18) NOT NULL,
    "fee" DECIMAL(36,18) NOT NULL,
    "netAmount" DECIMAL(36,18) NOT NULL,
    "address" TEXT NOT NULL,
    "memo" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Holding_userId_symbol_idx" ON "Holding"("userId", "symbol");

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
