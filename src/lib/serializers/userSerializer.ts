import { User } from "@prisma/client";
import { getUserFullName } from "../utils/user";

export const userSerializer = (user: User) => {
  if (!user) {
    return {};
  }
  return {
    id: user.id,
    userHandle: user.userHandle,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: getUserFullName(user),
    avatarUrl: user.avatarUrl,
  };
};
