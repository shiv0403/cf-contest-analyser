import { UserContest, Problem } from "@prisma/client";
import { Prisma } from "@prisma/client";

type SubmissionWithContest = Prisma.SubmissionGetPayload<{
  include: {
    contest: {
      include: {
        userContests: true;
      };
    };
    problem: true;
  };
}>;

export function getRatingChange(contest: UserContest) {
  const ratingChange = contest.newRating - contest.oldRating;
  const ratingChangeSign = ratingChange > 0 ? "+" : "-";
  const displayRatingChange =
    ratingChangeSign + Math.abs(ratingChange).toString();

  return displayRatingChange;
}

export function getAvgTime(
  userSubmissions: SubmissionWithContest[],
  solvedProblems: number
) {
  const firstOkSubmissions = userSubmissions
    .filter((submission) => submission.verdict === "OK")
    .sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds)
    .filter(
      (submission, index, self) =>
        index === self.findIndex((s) => s.problemId === submission.problemId)
    );

  return Math.floor(
    firstOkSubmissions.reduce(
      (sum, submission) => sum + submission.relativeTimeSeconds,
      0
    ) / solvedProblems
  );
}

export function generatePerformanceMetrics(
  userSubmissions: SubmissionWithContest[],
  userHandle: string,
  contestProblems: Problem[]
) {
  const solvedProblems = new Set(
    userSubmissions
      .filter((submission) => submission.verdict === "OK")
      .map((submission) => submission.problemId)
  ).size;
  const totalProblems = contestProblems.length;
  const averageTime =
    solvedProblems > 0 ? getAvgTime(userSubmissions, solvedProblems) : 0;
  const successRate =
    userSubmissions.length > 0
      ? (solvedProblems / userSubmissions.length) * 100
      : 0.0;

  // Find the user contest to get rating change
  const userContest = userSubmissions[0]?.contest?.userContests.find(
    (uc: UserContest) => uc.userHandle === userHandle
  );

  return {
    ratingChange: userContest ? getRatingChange(userContest) : "0",
    solvedProblems,
    totalProblems,
    averageTime,
    successRate,
  };
}
