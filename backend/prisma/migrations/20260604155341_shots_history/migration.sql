-- AlterTable
ALTER TABLE "AiGameSession" ADD COLUMN     "aiShotsHistory" JSONB NOT NULL DEFAULT '[]';
