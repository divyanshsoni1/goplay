-- AlterTable: add referral columns to User
ALTER TABLE "User"
  ADD COLUMN "referralCode"  TEXT,
  ADD COLUMN "referralCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "referredById"  TEXT;

-- CreateTable: Referral
CREATE TABLE "Referral" (
    "id"         TEXT         NOT NULL,
    "senderId"   TEXT         NOT NULL,
    "receiverId" TEXT         NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique referral code per user
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex: lookup by referral code fast
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex: lookup referrals by referrer
CREATE INDEX "User_referredById_idx" ON "User"("referredById");

-- CreateIndex: a user can only be referred once
CREATE UNIQUE INDEX "Referral_receiverId_key" ON "Referral"("receiverId");

-- CreateIndex: fetch all referrals by sender
CREATE INDEX "Referral_senderId_idx" ON "Referral"("senderId");

-- CreateIndex: order referrals by date
CREATE INDEX "Referral_createdAt_idx" ON "Referral"("createdAt");

-- AddForeignKey: referredBy (User → User, self-referential)
ALTER TABLE "User"
  ADD CONSTRAINT "User_referredById_fkey"
  FOREIGN KEY ("referredById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Referral.senderId → User
ALTER TABLE "Referral"
  ADD CONSTRAINT "Referral_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Referral.receiverId → User
ALTER TABLE "Referral"
  ADD CONSTRAINT "Referral_receiverId_fkey"
  FOREIGN KEY ("receiverId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
