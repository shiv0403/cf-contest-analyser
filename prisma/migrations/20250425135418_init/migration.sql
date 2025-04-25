-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" SERIAL NOT NULL,
    "userHandle" TEXT NOT NULL,
    "insights" JSONB NOT NULL,
    "improvementPlan" JSONB NOT NULL,
    "recommendedProblems" JSONB NOT NULL,
    "weakTopics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);
