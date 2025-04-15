-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "timeConsumedMillis" DROP NOT NULL,
ALTER COLUMN "memoryConsumedBytes" DROP NOT NULL;
