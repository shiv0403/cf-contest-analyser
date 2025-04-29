/*
  Warnings:

  - You are about to drop the column `improvementPlan` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `insights` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedProblems` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `weakTopics` on the `AiAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AiAnalysis" DROP COLUMN "improvementPlan",
DROP COLUMN "insights",
DROP COLUMN "recommendedProblems",
DROP COLUMN "weakTopics",
ADD COLUMN     "analysis" JSONB NOT NULL DEFAULT '{}';
