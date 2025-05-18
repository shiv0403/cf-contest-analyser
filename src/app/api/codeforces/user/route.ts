import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    const errorResponse = handleError(
      new ValidationError("Codeforces handle is required")
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const data = await response.json();

    if (data.status !== "OK") {
      const errorResponse = handleError(
        new ValidationError("Failed to fetch user info")
      );
      return new Response(errorResponse.body, {
        status: errorResponse.statusCode,
      });
    }

    const user = data.result[0];

    if (!user.email) {
      const errorResponse = handleError(
        new ValidationError("Please make your email visible on Codeforces")
      );
      return new Response(errorResponse.body, {
        status: errorResponse.statusCode,
      });
    }

    return NextResponse.json({ email: user.email });
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
