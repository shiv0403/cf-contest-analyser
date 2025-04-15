-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "userHandle" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "timeConsumedMillis" INTEGER NOT NULL,
    "memoryConsumedBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
