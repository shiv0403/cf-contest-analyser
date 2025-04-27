"use server";

import { signupSchema } from "@/schemas/auth";
import { createUser } from "@/lib/utils/user";
import { Prisma } from "@prisma/client";
import { getDbErrors } from "@/lib/helpers/dbErrors";

export async function signup(prevState: object, formData: FormData) {
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("codeforces-username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  const fieldValues = {
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword,
  };

  try {
    const validatedFields = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        errors: Object.values(
          validatedFields.error.flatten().fieldErrors
        ).flat(),
        values: fieldValues,
      };
    }

    const user = await createUser({
      firstName,
      lastName,
      email,
      username,
      password,
    });

    if (!user) {
      throw new Error("User not created");
    }

    return {
      ...prevState,
      errors: [],
      success: true,
      message: "User created successfully",
      values: {},
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.userHandle,
      },
    };
  } catch (error) {
    let errorMsg = "Something went wrong";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMsg = getDbErrors(error);
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    return {
      ...prevState,
      errors: [errorMsg],
      success: false,
      message: "User not created",
      values: fieldValues,
    };
  }
}
