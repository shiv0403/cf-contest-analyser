import { UserCreateParams } from "@/app/types/user";
import { prisma } from "@/lib/db";
import { hashPassword } from "../helpers/auth";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }
  return user;
};

export const getUserByUserHandle = async (userHandle: string) => {
  const user = await prisma.user.findUnique({
    where: {
      userHandle: userHandle,
    },
  });

  if (!user) {
    return null;
  }
  return user;
};

export const createUser = async (userParams: UserCreateParams) => {
  const { firstName, lastName, email, username, password } = userParams;

  // Validate unique email and username
  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }
  const existingUsername = await getUserByUserHandle(username);
  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      userHandle: username,
      password: hashedPassword,
    },
  });

  return user;
};
