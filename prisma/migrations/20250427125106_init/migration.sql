/*
  Warnings:

  - Added the required column `name` to the `Lockout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lockout" ADD COLUMN     "name" TEXT NOT NULL;
