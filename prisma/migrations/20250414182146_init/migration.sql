-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "frozen" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "startTimeSeconds" INTEGER NOT NULL,
    "relativeTimeSeconds" INTEGER NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);
