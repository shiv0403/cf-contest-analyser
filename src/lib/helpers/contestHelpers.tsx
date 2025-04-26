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

export function getRatingColors(rating: number | string) {
  if (typeof rating === "string") {
    rating = parseInt(rating);
  }

  if (rating < 1200) {
    return "#CCCCCC"; // Grey
  } else if (rating >= 1200 && rating < 1400) {
    return "#77FF77"; // Green
  } else if (rating >= 1400 && rating < 1600) {
    return "#78DDBB"; // Cyan
  } else if (rating >= 1600 && rating < 1900) {
    return "#AAAAFF"; // Blue
  } else if (rating >= 1900 && rating < 2100) {
    return "#FF88FF"; // Purple
  } else if (rating >= 2100 && rating < 2300) {
    return "#FFCC88"; // Orange
  } else if (rating >= 2300 && rating < 2400) {
    return "#FFBB55"; // Yellow
  } else if (rating >= 2400 && rating < 2600) {
    return "#FF7777"; // Red
  } else if (rating >= 2600 && rating < 3000) {
    return "#FF3433"; // Dark Red
  } else if (rating >= 3000) {
    return "#AA0000";
  }
}

export function darkenHexColor(hex: string, amount = 20) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Decrease each channel but make sure it doesn't go below 0
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Convert back to hex and pad with 0 if needed
  const newHex =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return newHex;
}
