"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export async function signup(formData: FormData) {
  try {
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const userHandle = formData.get("codeforces-username") as string;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !userHandle
    ) {
      return {
        errors: ["All fields are required"],
        success: false,
      };
    }

    if (password !== confirmPassword) {
      return {
        errors: ["Passwords do not match"],
        success: false,
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userHandle }],
      },
    });

    if (existingUser) {
      return {
        errors: ["Email or Codeforces handle already exists"],
        success: false,
      };
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userHandle,
      },
    });

    return {
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userHandle: user.userHandle,
      },
    };
  } catch (error) {
    return {
      errors: [
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
      ],
      success: false,
    };
  }
}
