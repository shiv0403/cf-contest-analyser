import { prisma } from "@/lib/db";

export const getProblemsFromContestIdAndIndex = async (
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
