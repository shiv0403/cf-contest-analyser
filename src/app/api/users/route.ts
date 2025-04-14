import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { UserContest } from "@/app/types/contest.types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userHandle = searchParams.get("userHandle");

  const res = await fetch(
    `https://codeforces.com/api/user.rating?handle=${userHandle}`
  );
  const data = await res.json();

  if (data.status !== "OK") {
    return new Response("Error fetching data", {
      status: 500,
    });
  }

  const allContests = await prisma.contest.findMany();

  const contests = data.result.map((userContest: UserContest) => {
    const contestDetails = allContests.find(
      (c) => c.contestId === userContest.contestId
    );
    if (!contestDetails) {
      return null;
    }
    return {
      contestId: userContest.contestId,
      contestName: userContest.contestName,
      handle: userContest.handle,
      rank: userContest.rank,
      ratingUpdateTimeSeconds: userContest.ratingUpdateTimeSeconds,
      oldRating: userContest.oldRating,
      newRating: userContest.newRating,
      date: new Date(contestDetails.startTimeSeconds * 1000).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ),
    };
  });

  return new Response(JSON.stringify(contests));
}
