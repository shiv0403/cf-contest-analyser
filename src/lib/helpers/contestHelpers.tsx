import { ProblemAnalysisType } from "@/app/types/contest.types";
import { UserContest, Problem, Submission } from "@prisma/client";
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

export function generateProblemAnalysisData(
  userSubmissions: Array<Submission>,
  contestProblems: Array<Problem>
) {
  const problemAnalysisData: Array<ProblemAnalysisType> = [];
  const userAcceptedSubmissions = userSubmissions
    .filter((submission) => submission.verdict === "OK")
    .sort((a, b) => {
      const problemA = contestProblems.find((p) => p.id === a.problemId);
      const problemB = contestProblems.find((p) => p.id === b.problemId);
      return (problemA?.index || "").localeCompare(problemB?.index || "");
    });
  contestProblems.forEach((problem) => {
    const userProblemSubmissions = userSubmissions
      .filter((submission) => submission.problemId === problem.id)
      .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);

    const problemData: ProblemAnalysisType = {
      id: problem.index,
      name: "",
      index: "",
      status: "",
      timeTaken: "",
      wrongAttempts: 0,
      difficulty: 0,
    };
    problemData["index"] = problem.index;
    problemData["name"] = problem.name;
    problemData["status"] =
      userProblemSubmissions.length > 0
        ? userProblemSubmissions[0].verdict
        : "NO SUBMISSION";
    problemData["timeTaken"] =
      userAcceptedSubmissions.length > 0
        ? getTimeTaken(userAcceptedSubmissions, problem)
        : "";
    problemData["wrongAttempts"] = userProblemSubmissions?.filter(
      (submission) => submission.verdict !== "OK"
    )?.length;
    problemData["difficulty"] = problem.rating;
    problemAnalysisData.push(problemData);
  });
  problemAnalysisData.sort((a, b) => {
    return a.index.localeCompare(b.index);
  });
  problemAnalysisData.forEach((problem) => {
    problem["status"] = problem["status"] === "OK" ? "AC" : problem["status"];
    problem["status"] =
      problem["status"] === "NO SUBMISSION"
        ? "NO SUBMISSION"
        : problem["status"];
    problem["status"] =
      problem["status"] === "WRONG_ANSWER" ? "WA" : problem["status"];
    problem["status"] =
      problem["status"] === "TIME_LIMIT_EXCEEDED" ? "TLE" : problem["status"];
    problem["status"] =
      problem["status"] === "RUNTIME_ERROR" ? "RE" : problem["status"];
    problem["status"] =
      problem["status"] === "COMPILATION_ERROR" ? "CE" : problem["status"];
    problem["status"] =
      problem["status"] === "PARTIAL" ? "PARTIAL" : problem["status"];
    problem["status"] =
      problem["status"] === "SKIPPED" ? "SKIPPED" : problem["status"];
  });
  return problemAnalysisData;
}

function getTimeTaken(
  userAcceptedSubmissions: Array<Submission>,
  problem: Problem
) {
  const seconds =
    userAcceptedSubmissions.findIndex((s) => s.problemId === problem.id) > 0
      ? userAcceptedSubmissions[
          userAcceptedSubmissions.findIndex((s) => s.problemId === problem.id)
        ].relativeTimeSeconds -
        userAcceptedSubmissions[
          userAcceptedSubmissions.findIndex((s) => s.problemId === problem.id) -
            1
        ].relativeTimeSeconds
      : userAcceptedSubmissions.find((s) => s.problemId === problem.id)
          ?.relativeTimeSeconds || 0;
  return `${Math.round(seconds / 60)} min`;
}
