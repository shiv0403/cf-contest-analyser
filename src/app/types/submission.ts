import { Prisma } from "@prisma/client";

export type SubmissionWithProblem = Prisma.SubmissionGetPayload<{
  include: { problem: true };
}>;
