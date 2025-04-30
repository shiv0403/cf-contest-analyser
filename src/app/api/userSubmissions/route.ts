/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import {
  generatePerformanceMetrics,
  generateProblemAnalysisData,
} from "@/lib/helpers/contestHelpers";
import {
  handleError,
  InsufficientParametersError,
} from "@/lib/utils/errorHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userHandle = searchParams.get("userHandle");
    const contestId = searchParams.get("contestId");

    if (!userHandle || !contestId) {
      throw new InsufficientParametersError();
    }

    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${userHandle}`
    );
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error("Error fetching user submissions data");
    }

    // Get current user submissions
    const currentUserSubmissions = await prisma.submission.findMany({
      where: {
        userHandle: userHandle,
        contestId: parseInt(contestId),
      },
    });

    // Insert new contestant submissions
    const newSubmissions = data.result.filter(
      (submission: {
        contestId: number;
        author: { participantType: string };
      }) =>
        !currentUserSubmissions.some(
          (s) => s.contestId === submission.contestId
        ) &&
        submission.author.participantType === "CONTESTANT" &&
        submission.contestId === parseInt(contestId)
    );

    // create an object with problem index vs problemId
    const contestProblems = await prisma.problem.findMany({
      where: {
        contestId: parseInt(contestId),
      },
    });

    const problemIndexToIdMap = contestProblems.reduce((acc, problem) => {
      acc[problem.index] = problem.id;
      return acc;
    }, {} as Record<string, number>);

    const submissionData = newSubmissions.map((submission: any) => ({
      contestId: submission.contestId,
      problemId: problemIndexToIdMap[submission.problem.index], // Use the map to get the problemId
      userHandle: userHandle,
      verdict: submission.verdict,
      language: submission.programmingLanguage,
      creationTimeSeconds: submission.creationTimeSeconds,
      relativeTimeSeconds: submission.relativeTimeSeconds,
      timeConsumedMillis: submission.timeConsumedMillis,
      memoryConsumedBytes: submission.memoryConsumedBytes,
    }));

    if (submissionData.length > 0) {
      await prisma.submission.createMany({
        data: submissionData,
      });
    }
    const userSubmissions = await prisma.submission.findMany({
      where: {
        userHandle: userHandle,
        contestId: parseInt(contestId),
      },
      include: {
        problem: true,
        contest: {
          include: {
            userContests: true,
          },
        },
      },
    });

    // Get and store performance metrics for the contest of the user
    let performanceMetrics = await prisma.performanceMetrics.findFirst({
      where: {
        userHandle: userHandle,
        contestId: parseInt(contestId),
      },
    });

    if (!performanceMetrics) {
      const performanceMetricsData = generatePerformanceMetrics(
        userSubmissions,
        userHandle,
        contestProblems
      );
      performanceMetrics = await prisma.performanceMetrics.create({
        data: {
          userHandle: userHandle,
          contestId: parseInt(contestId),
          ratingChange: performanceMetricsData.ratingChange,
          problemsSolved: performanceMetricsData.solvedProblems,
          totalProblems: performanceMetricsData.totalProblems,
          avgTimePerProblem: performanceMetricsData.averageTime,
          successRate: performanceMetricsData.successRate,
        },
      });
    }

    const serializedPerformanceMetrics = JSON.parse(
      JSON.stringify(performanceMetrics)
    );
    serializedPerformanceMetrics.avgTimePerProblem = `${Math.ceil(
      (performanceMetrics?.avgTimePerProblem || 0) / 60
    )} min`;
    serializedPerformanceMetrics.successRate = `${(
      performanceMetrics?.successRate || 0
    ).toFixed(1)} %`;

    const problemAnalysis = generateProblemAnalysisData(
      userSubmissions,
      contestProblems
    );

    return new Response(
      JSON.stringify({
        performanceMetrics: serializedPerformanceMetrics,
        problemAnalysis,
        contestProblems,
      })
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
