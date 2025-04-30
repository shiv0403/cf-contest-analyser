import { prisma } from "@/lib/db";
import { CfProblem, Contest } from "@/app/types/contest.types";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

// Contest sync cron
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const res = await fetch(`https://codeforces.com/api/contest.list`);
  const data = await res.json();
  const currentContests = await prisma.contest.findMany();

  const contestsData = data.result
    .filter(
      (contest: Contest) =>
        !currentContests.some((c) => c.contestId === contest.id)
    )
    .map((contest: Contest) => ({
      contestId: contest.id,
      name: contest.name,
      type: contest.type,
      phase: contest.phase,
      frozen: contest.frozen.toString(),
      durationSeconds: contest.durationSeconds,
      startTimeSeconds: contest.startTimeSeconds,
      relativeTimeSeconds: contest.relativeTimeSeconds,
    }));

  if (contestsData.length > 0) {
    await prisma.contest.createMany({ data: contestsData });
  }

  // Fetch problems from Codeforces API
  const problemsRes = await fetch(
    `https://codeforces.com/api/problemset.problems`
  );
  const problemsData = await problemsRes.json();
  const currentProblems = await prisma.problem.findMany();

  // Insert new problems and check before that problem exists
  const problems = problemsData.result.problems
    .filter(
      (problem: { contestId: number }) =>
        !currentProblems.some((p) => p.contestId === problem.contestId)
    )
    .map((problem: CfProblem) => ({
      contestId: problem.contestId,
      name: problem.name,
      index: problem.index,
      type: problem.type,
      points: problem.points || 0,
      rating: problem.rating || 0,
      tags: problem.tags,
    }));

  if (problems.length > 0) {
    await prisma.problem.createMany({
      data: problems,
    });
  }

  return sendSuccessResponse(
    {
      contestsSynced: contestsData.length,
      problemsSynced: problems.length,
    },
    "Contests and problems synced successfully",
    undefined,
    201
  );
}
