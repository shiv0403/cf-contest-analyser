import { Problem } from "@prisma/client";

export const problemSerializer = (problem: Problem) => {
  if (!problem) {
    return {};
  }

  return {
    id: problem.id,
    contestId: problem.contestId,
    index: problem.index,
    name: problem.name,
    rating: problem.rating,
    tags: problem.tags,
  };
};
