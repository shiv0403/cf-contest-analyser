/*
  Warnings:

  - Added the required column `durationSeconds` to the `Lockout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lockout" ADD COLUMN     "durationSeconds" INTEGER NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
