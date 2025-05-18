import { prisma } from "@/lib/db";
import { topicToTagMap } from "@/lib/utils/topicTagMap";

export const getProblemFromContestIdAndIndex = async (
  contestId: number,
  index: string
) => {
  const problem = await prisma.problem.findFirst({
    where: {
      contestId: contestId,
      index: index,
    },
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  return problem;
};

export const findPracticeProblems = async (
  topic: string,
  userRating: number,
  limit: number = 8
) => {
  // Map general topic to Codeforces tags
  const tags = topicToTagMap[topic.toLowerCase()] || [topic];
  const minRating = Math.max(800, userRating - 200);
  const maxRating = userRating + 300;

  const problems = await prisma.problem.findMany({
    where: {
      tags: {
        hasSome: tags,
      },
      rating: {
        gte: minRating,
        lte: maxRating,
      },
    },
    orderBy: {
      rating: "asc",
    },
    take: limit,
  });

  return problems.map((problem) => ({
    name: problem.name,
    difficulty: problem.rating.toString(),
    link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    conceptsCovered: problem.tags,
  }));
};
