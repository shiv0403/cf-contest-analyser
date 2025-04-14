import { prisma } from "@/lib/db";

type Contest = {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: string;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
};

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

  const records = await prisma.contest.createMany({ data: contestsData });

  return new Response(
    `Contests sync cron ran at ${Date.now()} and inserted ${records} records`,
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}
