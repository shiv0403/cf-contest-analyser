import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user submissions from Codeforces API
    const submissionsResponse = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    const submissionsData = await submissionsResponse.json();

    if (submissionsData.status !== "OK") {
      throw new Error("Failed to fetch submissions from Codeforces");
    }

    // Fetch user info from Codeforces API
    const userInfoResponse = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const userInfoData = await userInfoResponse.json();

    if (userInfoData.status !== "OK") {
      throw new Error("Failed to fetch user info from Codeforces");
    }

    // Process submissions to calculate metrics
    const submissions = submissionsData.result;
    const problemsSolved = new Set();
    let totalTime = 0;
    let successfulSubmissions = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submissions.forEach((submission: any) => {
      const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
      if (submission.verdict === "OK") {
        problemsSolved.add(problemId);
        successfulSubmissions++;
        totalTime += submission.timeConsumedMillis;
      }
    });

    const performanceMetrics = {
      ratingChange: userInfoData.result[0].rating || 0,
      problemsSolved: problemsSolved.size,
      totalProblems: submissions.length,
      avgTimePerProblem: Math.round(
        totalTime / (problemsSolved.size || 1) / 1000 / 60
      ), // in minutes
      successRate: Math.round(
        (successfulSubmissions / submissions.length) * 100
      ),
    };

    return NextResponse.json({
      submissions: submissionsData.result,
      performanceMetrics,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
