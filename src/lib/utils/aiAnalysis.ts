interface Problem {
  contestId: number;
  index: string;
  rating?: number;
  tags?: string[];
}

interface Submission {
  id: number;
  contestId: number;
  problem: Problem;
  verdict: string;
  programmingLanguage: string;
  timeConsumedMillis: number;
  creationTimeSeconds: number;
}

interface UserInfo {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  contribution?: number;
  registrationTimeSeconds: number;
}

export const getUserDataForAiAnalysis = async (username: string) => {
  // Fetch user submissions from Codeforces API
  const submissionsResponse = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}`
  );
  const submissionsData = await submissionsResponse.json();

  if (submissionsData.status !== "OK") {
    throw new Error("Failed to fetch submissions from Codeforces");
  }

  // Fetch user info from Codeforces API
  const userInfoResponse = await fetch(
    `https://codeforces.com/api/user.info?handles=${username}`
  );
  const userInfoData = await userInfoResponse.json();

  if (userInfoData.status !== "OK") {
    throw new Error("Failed to fetch user info from Codeforces");
  }

  const submissions = submissionsData.result as Submission[];
  const userInfo = userInfoData.result[0] as UserInfo;

  // Process submissions to calculate metrics
  const problemsSolved = new Set();
  const tagFrequency: Record<string, number> = {};
  const ratingWiseSolved: Record<string, number> = {};
  const verdictDistribution: Record<string, number> = {};
  const languagePreference: Record<string, number> = {};
  let totalTime = 0;
  let successfulSubmissions = 0;
  let lastMonthSubmissions = 0;
  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  // Track recent activity and problem-solving patterns
  const recentProblems = new Set();
  const recentTags = new Set();

  submissions.forEach((submission: Submission) => {
    const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
    const submissionTime = submission.creationTimeSeconds * 1000;

    // Count verdicts
    verdictDistribution[submission.verdict] =
      (verdictDistribution[submission.verdict] || 0) + 1;

    // Track language preference
    languagePreference[submission.programmingLanguage] =
      (languagePreference[submission.programmingLanguage] || 0) + 1;

    // Process successful submissions
    if (submission.verdict === "OK") {
      problemsSolved.add(problemId);
      successfulSubmissions++;
      totalTime += submission.timeConsumedMillis;

      // Track problem rating distribution
      const rating = submission.problem.rating || "unrated";
      ratingWiseSolved[rating] = (ratingWiseSolved[rating] || 0) + 1;

      // Process tags
      submission.problem.tags?.forEach((tag: string) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });

      // Track recent activity (last 30 days)
      if (submissionTime > oneMonthAgo) {
        lastMonthSubmissions++;
        recentProblems.add(problemId);
        submission.problem.tags?.forEach((tag: string) => recentTags.add(tag));
      }
    }
  });

  // Calculate preferred topics (top 5 tags)
  const preferredTopics = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  // Calculate most used languages (top 3)
  const preferredLanguages = Object.entries(languagePreference)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang);

  const processedData = {
    userProfile: {
      handle: userInfo.handle,
      rating: userInfo.rating || 0,
      maxRating: userInfo.maxRating || 0,
      rank: userInfo.rank || "unrated",
      contribution: userInfo.contribution || 0,
      registrationTimeSeconds: userInfo.registrationTimeSeconds,
    },
    performanceMetrics: {
      totalProblems: submissions.length,
      problemsSolved: problemsSolved.size,
      successRate: Math.round(
        (successfulSubmissions / submissions.length) * 100
      ),
      avgTimePerProblem: Math.round(
        totalTime / (problemsSolved.size || 1) / 1000 / 60
      ), // in minutes
      activeLastMonth: lastMonthSubmissions > 0,
      monthlyActivity: lastMonthSubmissions,
      recentProblemsSolved: recentProblems.size,
      recentTopicsCovered: recentTags.size,
    },
    problemSolvingPatterns: {
      preferredTopics,
      ratingDistribution: ratingWiseSolved,
      verdictDistribution,
      preferredLanguages,
    },
  };

  return processedData;
};
