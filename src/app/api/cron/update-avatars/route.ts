import { prisma } from "@/lib/db";
import { ValidationError } from "@/lib/utils/errorHandler";
import { handleError } from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

interface CodeforcesUser {
  titlePhoto: string;
}

interface UpdateOperation {
  where: { id: number };
  data: { avatarUrl: string };
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new ValidationError("Unauthorized");
    }

    const users = await prisma.user.findMany();
    const BATCH_SIZE = 10;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      const handles = batch.map((user) => user.userHandle).join(";");

      const res = await fetch(
        `https://codeforces.com/api/user.info?handles=${handles}`
      );
      const data = await res.json();

      const updates = data.result.map(
        (userData: CodeforcesUser, index: number) => ({
          where: { id: batch[index].id },
          data: { avatarUrl: userData.titlePhoto },
        })
      );

      await Promise.all(
        updates.map((update: UpdateOperation) => prisma.user.update(update))
      );
    }

    return sendSuccessResponse({ success: true }, "Avatars updated");
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to update avatars: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
