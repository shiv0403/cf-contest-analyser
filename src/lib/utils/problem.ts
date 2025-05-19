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
  userRating: number[],
  limit: number = 10,
  page: number = 1
) => {
  const tags = topicToTagMap[topic.toLowerCase()] || [topic];
  const minRating = Math.min(...userRating);
  const maxRating = Math.max(...userRating);

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
    skip: (page - 1) * limit,
  });

  return problems.map((problem) => ({
    name: problem.name,
    difficulty: problem.rating.toString(),
    link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    conceptsCovered: problem.tags,
  }));
};
