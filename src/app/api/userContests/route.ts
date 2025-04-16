import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { CfUserContest } from "@/app/types/contest.types";
import { Prisma } from "@prisma/client";

// Define the type for UserContest with included contest
type UserContestWithContest = Prisma.UserContestGetPayload<{
  include: { contest: true };
}>;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userHandle = searchParams.get("userHandle");

  if (!userHandle) {
    return new Response("Insufficient Parameters", {
      status: 400,
    });
  }

  // Fetch user contests from Codeforces API for latest userContests
  const res = await fetch(
    `https://codeforces.com/api/user.rating?handle=${userHandle}`
  );
  const data = await res.json();

  if (data.status !== "OK") {
    return new Response("Error fetching data", {
      status: 500,
    });
  }

  const existingUserContests = await prisma.userContest.findMany({
    where: {
      userHandle: userHandle,
    },
  });

  // Fetch new userContests
  const newUserContests = data.result.filter((contest: CfUserContest) =>
    existingUserContests.every((c) => c.contestId !== contest.contestId)
  );

  const allContests = await prisma.contest.findMany();
  const contestIds = allContests.map((contest) => contest.contestId);

  // Insert new userContests and check before that contest exists
  if (newUserContests.length > 0) {
    const newUserContestData = newUserContests
      .filter((contest: CfUserContest) =>
        contestIds.includes(contest.contestId)
      )
      .map((contest: CfUserContest) => ({
        contestId: contest.contestId,
        userHandle: userHandle,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
      }));
    if (newUserContestData.length > 0) {
      await prisma.userContest.createMany({
        data: newUserContestData,
      });
    }
  }

  const userContestList = (await prisma.userContest.findMany({
    where: {
      userHandle: userHandle,
    },
    include: { contest: true },
  })) as UserContestWithContest[];

  const userContestData = userContestList.map((userContest) => ({
    contestId: userContest.contestId,
    contestName: userContest.contest.name,
    handle: userContest.userHandle,
    rank: userContest.rank,
    oldRating: userContest.oldRating,
    newRating: userContest.newRating,
    date: new Date(
      userContest.contest.startTimeSeconds * 1000
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return new Response(JSON.stringify(userContestData));
}
