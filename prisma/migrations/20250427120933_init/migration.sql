-- CreateTable
CREATE TABLE "Lockout" (
    "id" SERIAL NOT NULL,
    "inviteeId" INTEGER NOT NULL,
    "hostId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "problemIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lockout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockoutSubmission" (
    "id" SERIAL NOT NULL,
    "lockoutId" INTEGER NOT NULL,
    "userHandle" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LockoutSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LockoutSubmission_submissionId_key" ON "LockoutSubmission"("submissionId");

-- AddForeignKey
ALTER TABLE "Lockout" ADD CONSTRAINT "Lockout_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lockout" ADD CONSTRAINT "Lockout_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lockout" ADD CONSTRAINT "Lockout_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockoutSubmission" ADD CONSTRAINT "LockoutSubmission_lockoutId_fkey" FOREIGN KEY ("lockoutId") REFERENCES "Lockout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockoutSubmission" ADD CONSTRAINT "LockoutSubmission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockoutSubmission" ADD CONSTRAINT "LockoutSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
