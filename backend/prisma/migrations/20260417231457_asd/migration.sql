-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
