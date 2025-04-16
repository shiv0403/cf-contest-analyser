/*
  Warnings:

  - A unique constraint covering the columns `[contestId]` on the table `Contest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserContest" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "userHandle" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "oldRating" INTEGER NOT NULL,
    "newRating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserContest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contest_contestId_key" ON "Contest"("contestId");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContest" ADD CONSTRAINT "UserContest_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetrics" ADD CONSTRAINT "PerformanceMetrics_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE RESTRICT ON UPDATE CASCADE;
