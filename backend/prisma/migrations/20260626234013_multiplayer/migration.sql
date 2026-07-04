/*
  Warnings:

  - The `status` column on the `AiGameSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OnlineGameSlot" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "GameSessionStatus" AS ENUM ('WAITING', 'ACTIVE', 'FINISHED', 'EXPIRED');

-- AlterTable
ALTER TABLE "AiGameSession" DROP COLUMN "status",
ADD COLUMN     "status" "GameSessionStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "AiGameSessionStatus";

-- CreateTable
CREATE TABLE "OnlineGameSession" (
    "id" SERIAL NOT NULL,
    "status" "GameSessionStatus" NOT NULL DEFAULT 'WAITING',
    "currentTurnUserId" INTEGER,
    "winnerUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineGameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineGamePlayer" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "board" JSONB NOT NULL,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "slot" "OnlineGameSlot" NOT NULL,

    CONSTRAINT "OnlineGamePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnlineGamePlayer_sessionId_userId_key" ON "OnlineGamePlayer"("sessionId", "userId");

-- AddForeignKey
ALTER TABLE "OnlineGamePlayer" ADD CONSTRAINT "OnlineGamePlayer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnlineGameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineGamePlayer" ADD CONSTRAINT "OnlineGamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
