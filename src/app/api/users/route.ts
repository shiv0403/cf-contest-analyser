import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userHandle = searchParams.get("userHandle");

  const res = await fetch(
    `https://codeforces.com/api/user.rating?handle=${userHandle}`
  );
  const data = await res.json();
  return new Response(JSON.stringify(data));
}
