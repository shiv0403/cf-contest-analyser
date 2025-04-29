import { Prisma } from "@prisma/client";

export type LockoutSubmissionWithProblemAndSubmission =
  Prisma.LockoutSubmissionGetPayload<{
    include: { submission: { include: { problem: true } } };
  }>;
