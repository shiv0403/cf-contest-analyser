import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json(
      { error: "Codeforces handle is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 400 }
      );
    }

    const user = data.result[0];

    if (!user.email) {
      return NextResponse.json(
        { error: "Please make your email visible on Codeforces" },
        { status: 400 }
      );
    }

    return NextResponse.json({ email: user.email });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}
