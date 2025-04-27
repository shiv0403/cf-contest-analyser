import { Prisma } from "@prisma/client";

export const getDbErrors = (
  error: Prisma.PrismaClientKnownRequestError
): string => {
  if (error.code === "P2002") {
    const field = error.meta?.target;
    return `${field} already exists`;
  }
  return "Something went wrong";
};
