-- CreateEnum
CREATE TYPE "AiGameTurn" AS ENUM ('USER', 'AI');

-- CreateEnum
CREATE TYPE "AiGameSessionStatus" AS ENUM ('ACTIVE', 'FINISHED', 'EXPIRED');

-- CreateTable
CREATE TABLE "AiGameSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "playerBoard" JSONB NOT NULL,
    "aiBoard" JSONB NOT NULL,
    "currentTurn" "AiGameTurn" NOT NULL DEFAULT 'USER',
    "status" "AiGameSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiGameSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiGameSession" ADD CONSTRAINT "AiGameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
