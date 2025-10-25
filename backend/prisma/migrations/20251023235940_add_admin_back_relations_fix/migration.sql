-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('USER_UPDATE', 'USER_DELETE', 'USER_FUND', 'USER_WIPE_BALANCES', 'WITHDRAWAL_STATUS_CHANGE', 'DEPOSIT_STATUS_CHANGE');

-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "adminStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "amount" DECIMAL(36,18) NOT NULL,
    "txId" TEXT,
    "adminStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAudit" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" "AdminAction" NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deposit_userId_idx" ON "Deposit"("userId");

-- CreateIndex
CREATE INDEX "AdminAudit_adminId_idx" ON "AdminAudit"("adminId");

-- CreateIndex
CREATE INDEX "AdminAudit_entity_entityId_idx" ON "AdminAudit"("entity", "entityId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAudit" ADD CONSTRAINT "AdminAudit_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
