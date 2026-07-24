-- CreateTable
CREATE TABLE "UserRatingHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRatingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRatingHistory_userId_createdAt_idx" ON "UserRatingHistory"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserRatingHistory" ADD CONSTRAINT "UserRatingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
