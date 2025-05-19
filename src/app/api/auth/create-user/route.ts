import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";
import { ValidationError } from "@/lib/utils/errorHandler";
import { handleError } from "@/lib/utils/errorHandler";
import { getUserAvatar } from "@/lib/utils/codeforces";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, userHandle } =
      await request.json();

    if (!firstName || !lastName || !email || !password || !userHandle) {
      throw new ValidationError("All fields are required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userHandle }],
      },
    });

    if (existingUser) {
      throw new ValidationError("Email or Codeforces handle already exists");
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);
    const userAvatar = await getUserAvatar(userHandle);

    // Create the user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userHandle,
        emailVerified: true,
        avatarUrl: userAvatar,
      },
    });

    return sendSuccessResponse({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userHandle: user.userHandle,
      },
    });
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to create user account: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
