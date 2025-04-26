import {
  CfUserInfo,
  Contest,
  UserRatingChange,
  UserSubmission,
} from "@/app/types/contest.types";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

type TimeRange = "1month" | "3months" | "6months" | "all";
type UsersSubmissions = Record<string, Array<UserSubmission>>;

interface ChartData {
  dates: string[]; // or whatever type you're pushing
  user1: number[];
  user2: number[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const compareToUserHandle = searchParams.get("compareToUserHandle");
  const userHandle = searchParams.get("userHandle");

  if (!userHandle || !compareToUserHandle) {
    return new Response("Insufficient Parameters", {
      status: 400,
    });
  }

  const result = await getUsersInfo(userHandle, compareToUserHandle);
  if (result.status === 500) {
    return new Response(result.errorMessage, {
      status: result.status,
    });
  }

  const userInfo = result.result[0];
  const compareToUserInfo = result.result[1];

  const usersSubmissions = await getUsersSubmissions(
    userHandle,
    compareToUserHandle
  );

  if (usersSubmissions.status === 500) {
    return new Response(usersSubmissions.errorMessage, {
      status: usersSubmissions.status,
    });
  }

  const ratingChartData = await getRatingChartData(
    userHandle,
    compareToUserHandle
  );
  if (ratingChartData.status === 500) {
    return new Response(ratingChartData.errorMessage, {
      status: ratingChartData.status,
    });
  }

  const difficultyChartData = await getDifficultyChartData(
    userHandle,
    compareToUserHandle,
    usersSubmissions
  );

  const topicProficiencyChartData = await getTopicProficiencyChartData(
    userHandle,
    compareToUserHandle,
    usersSubmissions
  );

  return new Response(
    JSON.stringify({
      userInfo: serializeUserInfo(userInfo),
      compareToUserInfo: serializeUserInfo(compareToUserInfo),
      ratingChartData: ratingChartData.formattedChartData,
      contestPerformanceComparison:
        ratingChartData.contestPerformanceComparison,
      difficultyChartData,
      topicProficiencyChartData,
    })
  );
}

function serializeUserInfo(userInfo: CfUserInfo) {
  return {
    username: userInfo.handle,
    avatar: userInfo.avatar,
    country: userInfo.country,
    rank: userInfo.rank,
    rating: userInfo.rating,
    maxRating: userInfo.maxRating,
  };
}

async function getUsersInfo(userHandle: string, compareToUserHandle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${userHandle};${compareToUserHandle}`
  );
  const data = await res.json();
  if (data.status !== "OK") {
    return {
      errorMessage: `Error fetching user info data: ${data.comment}`,
      status: 500,
    };
  }
  return data;
}

async function getRatingChartData(
  userHandle: string,
  compareToUserHandle: string
) {
  const res1 = await getRatingDetailsOfUser(userHandle);
  const res2 = await getRatingDetailsOfUser(compareToUserHandle);

  if (res1.status === 500 || res2.status === 500) {
    return {
      errorMessage: `Error fetching ratings data: ${
        res1.errorMessage || res2.errorMessage
      }`,
      status: 500,
    };
  }

  const userRatingChanges = res1.result;
  const compareToUserRatingChanges = res2.result;

  const commonContestIds = getCommonContests(
    userRatingChanges,
    compareToUserRatingChanges
  );
  const commonContests = await prisma.contest.findMany({
    where: {
      contestId: {
        in: commonContestIds,
      },
    },
  });

  const contestPerformanceComparison = getContestPerformanceComparison(
    userRatingChanges,
    compareToUserRatingChanges,
    commonContests
  );

  const formattedChartData = getFormattedChartData(
    userRatingChanges,
    compareToUserRatingChanges,
    commonContests
  );

  return {
    formattedChartData,
    contestPerformanceComparison,
  };
}

function getContestPerformanceComparison(
  userRatingChanges: Array<UserRatingChange>,
  compareToUserRatingChanges: Array<UserRatingChange>,
  commonContests: Array<Contest>
) {
  const contestComparisonData: Array<{
    contestName: string;
    contestDate: string;
    userRatingChanges: string;
    compareToUserRatingChanges: string;
  }> = [];
  commonContests.forEach((contest) => {
    const userContest = userRatingChanges.find(
      (contestChange) => contestChange.contestId === contest.contestId
    );
    const compareToUserContest = compareToUserRatingChanges.find(
      (contestChange) => contestChange.contestId === contest.contestId
    );

    if (userContest && compareToUserContest) {
      contestComparisonData.push({
        contestName: contest.name,
        contestDate: new Date(
          contest.startTimeSeconds * 1000
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        userRatingChanges:
          userContest.newRating - userContest.oldRating >= 0
            ? `+${userContest.newRating - userContest.oldRating}`
            : `${userContest.newRating - userContest.oldRating}`,
        compareToUserRatingChanges:
          compareToUserContest.newRating - compareToUserContest.oldRating >= 0
            ? `+${
                compareToUserContest.newRating - compareToUserContest.oldRating
              }`
            : `${
                compareToUserContest.newRating - compareToUserContest.oldRating
              }`,
      });
    }
  });

  contestComparisonData.sort((a, b) => {
    const dateA = new Date(a.contestDate);
    const dateB = new Date(b.contestDate);
    return dateB.getTime() - dateA.getTime();
  });
  return contestComparisonData;
}

async function getUsersSubmissions(
  userHandle: string,
  compareToUserHandle: string
) {
  const res1 = await getUserSubmissions(userHandle);
  const res2 = await getUserSubmissions(compareToUserHandle);

  if (res1.status === 500 || res2.status === 500) {
    return {
      errorMessage: `Error fetching submissions data: ${
        res1.errorMessage || res2.errorMessage
      }`,
      status: 500,
      [userHandle]: [],
      [compareToUserHandle]: [],
    };
  }

  return {
    [userHandle]: res1.result,
    [compareToUserHandle]: res2.result,
    status: 200,
    errorMessage: "",
  };
}

async function getDifficultyChartData(
  userHandle: string,
  compareToUserHandle: string,
  usersSubmissions: UsersSubmissions
) {
  const userSolvedProblems = usersSubmissions[userHandle].filter(
    (submission: UserSubmission) => submission.verdict === "OK"
  );
  const compareToUserSolvedProblems = usersSubmissions[
    compareToUserHandle
  ].filter((submission: UserSubmission) => submission.verdict === "OK");

  const difficultyRanges = [
    "800-1000",
    "1000-1200",
    "1200-1400",
    "1400-1600",
    "1600-1800",
    "1800-2000",
    "2000-9000",
  ];

  const formattedChartData: Record<string, Array<number>> = {
    [userHandle]: [],
    [compareToUserHandle]: [],
  };

  difficultyRanges.forEach((difficultyRange) => {
    const [min, max] = difficultyRange.split("-").map(Number);
    const userSolvedCount = userSolvedProblems.filter(
      (problem: UserSubmission) => {
        const problemRating = problem.problem.rating || 0;
        return problemRating >= min && (max ? problemRating < max : true);
      }
    ).length;

    const compareToUserSolvedCount = compareToUserSolvedProblems.filter(
      (problem: UserSubmission) => {
        const problemRating = problem.problem.rating || 0;
        return problemRating >= min && (max ? problemRating < max : true);
      }
    ).length;

    formattedChartData[userHandle].push(userSolvedCount);
    formattedChartData[compareToUserHandle].push(compareToUserSolvedCount);
  });

  return formattedChartData;
}

async function getTopicProficiencyChartData(
  userHandle: string,
  compareToUserHandle: string,
  usersSubmissions: UsersSubmissions
) {
  const userSolvedProblems = usersSubmissions[userHandle].filter(
    (submission: UserSubmission) => submission.verdict === "OK"
  );
  const compareToUserSolvedProblems = usersSubmissions[
    compareToUserHandle
  ].filter((submission: UserSubmission) => submission.verdict === "OK");

  const topicProficiencyChartData: Record<string, Record<string, number>> = {
    [userHandle]: {},
    [compareToUserHandle]: {},
  };

  userSolvedProblems.forEach((problem: UserSubmission) => {
    problem.problem.tags.forEach((tag) => {
      topicProficiencyChartData[userHandle][tag] =
        (topicProficiencyChartData[userHandle][tag] || 0) + 1;
    });
  });

  compareToUserSolvedProblems.forEach((problem: UserSubmission) => {
    problem.problem.tags.forEach((tag) => {
      topicProficiencyChartData[compareToUserHandle][tag] =
        (topicProficiencyChartData[compareToUserHandle][tag] || 0) + 1;
    });
  });

  const tags = new Set<string>();

  Object.values(topicProficiencyChartData).forEach((userData) => {
    Object.keys(userData).forEach((tag) => tags.add(tag));
  });

  const normalizedProficiency: Record<string, Record<string, number>> = {
    [userHandle]: {},
    [compareToUserHandle]: {},
  };

  tags.forEach((tag) => {
    const count1 = topicProficiencyChartData[userHandle][tag] || 0;
    const count2 = topicProficiencyChartData[compareToUserHandle][tag] || 0;
    const maxCount = Math.max(count1, count2, 1); // prevent divide-by-zero

    normalizedProficiency[userHandle][tag] = Math.round(
      (count1 / maxCount) * 100
    );
    normalizedProficiency[compareToUserHandle][tag] = Math.round(
      (count2 / maxCount) * 100
    );
  });

  // humanize the tags names
  const humanizedTags = Array.from(tags).map((tag) => {
    const words = tag.split(/(?=[A-Z])/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  return { humanizedTags, normalizedProficiency };
}

async function getUserSubmissions(userHandle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${userHandle}`
  );
  const data = await res.json();
  if (data.status !== "OK") {
    return {
      errorMessage: `Error fetching user submissions data: ${data.comment}`,
      status: 500,
    };
  }
  return data;
}

async function getRatingDetailsOfUser(userHandle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.rating?handle=${userHandle}`
  );
  const data = await res.json();
  if (data.status !== "OK") {
    return {
      errorMessage: `Error fetching rating chart data: ${data.comment}`,
      status: 500,
    };
  }
  return data;
}

function getCommonContests(
  userRatingChanges: Array<UserRatingChange>,
  compareToUserRatingChanges: Array<UserRatingChange>
) {
  const userContestIds = userRatingChanges.map((contest) => contest.contestId);
  const compareToUserContestIds = compareToUserRatingChanges.map(
    (contest) => contest.contestId
  );

  const commonContestIds = userContestIds.filter((contestId) =>
    compareToUserContestIds.includes(contestId)
  );

  return commonContestIds;
}

function getFormattedChartData(
  userRatingChanges: Array<UserRatingChange>,
  compareToUserRatingChanges: Array<UserRatingChange>,
  commonContests: Array<Contest>
) {
  const formattedChartData: Record<TimeRange, ChartData> = {
    "1month": { dates: [], user1: [], user2: [] },
    "3months": { dates: [], user1: [], user2: [] },
    "6months": { dates: [], user1: [], user2: [] },
    all: { dates: [], user1: [], user2: [] },
  };
  const timeRanges = ["1month", "3months", "6months", "all"];
  timeRanges.forEach((value: string) => {
    const timeRange = value as TimeRange;
    const timeRangeContests = commonContests
      .filter((contest) => {
        const contestDate = new Date(contest.startTimeSeconds * 1000);
        const now = new Date();
        const timeDiff = now.getTime() - contestDate.getTime();
        const timeDiffInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (timeRange === "1month") {
          return timeDiffInDays <= 30;
        } else if (timeRange === "3months") {
          return timeDiffInDays <= 90;
        } else if (timeRange === "6months") {
          return timeDiffInDays <= 180;
        } else if (timeRange === "all") {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

    const timeRangeContestIds = timeRangeContests.map(
      (contest) => contest.contestId
    );

    const userRatingChangesInTimeRange = userRatingChanges.filter((contest) =>
      timeRangeContestIds.includes(contest.contestId)
    );
    const compareToUserRatingChangesInTimeRange =
      compareToUserRatingChanges.filter((contest) =>
        timeRangeContestIds.includes(contest.contestId)
      );
    timeRangeContests.forEach((contest) => {
      formattedChartData[timeRange].dates.push(
        new Date(contest.startTimeSeconds * 1000).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
      formattedChartData[timeRange].user1.push(
        userRatingChangesInTimeRange.find(
          (ratingChange) => ratingChange.contestId === contest.contestId
        )?.newRating || 0
      );
      formattedChartData[timeRange].user2.push(
        compareToUserRatingChangesInTimeRange.find(
          (ratingChange) => ratingChange.contestId === contest.contestId
        )?.newRating || 0
      );
    });
  });

  return formattedChartData;
}
