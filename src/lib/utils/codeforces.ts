import { Lockout } from "@prisma/client";
import { prisma } from "@/lib/db";
import moment from "moment";
import { UserSubmission } from "@/app/types/contest.types";

export async function getUserRating(handle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const data = await res.json();
  if (data.status !== "OK") throw new Error("Invalid Codeforces handle");
  return data.result[0].rating; // returns rating as number
}

// limited to 50 submissions
export async function getUserSubmissionsForLockoutProblem(
  userHandle: string,
  lockout: Lockout
) {
  if (!lockout || !userHandle) {
    throw new Error("Invalid Lockout or user handle");
  }

  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${userHandle}&from=1&count=50`
  );
  const data = await res.json();
  if (data.status !== "OK") throw new Error("Invalid problem ID");
  const submissions = data.result; // returns submissions as array
  const problems = await prisma.problem.findMany({
    where: {
      id: {
        in: lockout.problemIds,
      },
    },
  });
  if (!problems) {
    throw new Error("Problem not found");
  }

  const problemIdVsSubmission: Record<number, UserSubmission> = {};
  problems.forEach((problem) => {
    const problemSubmissions = submissions.filter(
      (submission: {
        problem: {
          contestId: number;
          index: string;
        };
        creationTimeSeconds: number;
        verdict: string;
      }) =>
        submission.problem.contestId === problem.contestId &&
        submission.problem.index === problem.index &&
        submission.creationTimeSeconds >= moment(lockout.startTime).unix() &&
        submission.creationTimeSeconds <= moment(lockout.endTime).unix() &&
        submission.verdict === "OK" // filter only accepted submissions
    );
    if (problemSubmissions.length > 0) {
      problemIdVsSubmission[problem.id] = problemSubmissions.sort(
        (
          a: { creationTimeSeconds: number },
          b: { creationTimeSeconds: number }
        ) => a.creationTimeSeconds - b.creationTimeSeconds
      )[0];
    }
  });

  return problemIdVsSubmission;
}
