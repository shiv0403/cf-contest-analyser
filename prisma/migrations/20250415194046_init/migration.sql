-- CreateTable
CREATE TABLE "PerformanceMetrics" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "userHandle" TEXT NOT NULL,
    "ratingChange" TEXT NOT NULL,
    "problemsSolved" INTEGER NOT NULL,
    "totalProblems" INTEGER NOT NULL,
    "avgTimePerProblem" INTEGER NOT NULL,
    "successRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetrics_pkey" PRIMARY KEY ("id")
);
