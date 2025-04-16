/*
  Warnings:

  - Added the required column `creationTimeSeconds` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativeTimeSeconds` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "creationTimeSeconds" INTEGER NOT NULL,
ADD COLUMN     "relativeTimeSeconds" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
