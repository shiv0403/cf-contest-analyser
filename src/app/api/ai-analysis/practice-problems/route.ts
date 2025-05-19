import { getJwtToken } from "@/lib/utils/auth";
import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { findPracticeProblems } from "@/lib/utils/problem";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";
import { AiAnalysisResponse } from "@/app/types/ai-analysis";

export async function GET(request: NextRequest) {
  const token = await getJwtToken(request);

  if (!token) {
    const errorResponse = handleError(new ValidationError("Unauthorized"));
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }

  const { searchParams } = new URL(request.url);
  const topicName = searchParams.get("topicName");
  const userHandle = searchParams.get("userHandle");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!topicName || !userHandle) {
    const errorResponse = handleError(
      new ValidationError("Topic name and user handle are required")
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }

  if (token?.userHandle !== userHandle) {
    const errorResponse = handleError(
      new ValidationError(
        "You can only request practice problems for your own handle"
      )
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }

  const aiAnalysis = await prisma.aiAnalysis.findFirst({
    where: {
      userHandle,
    },
  });

  if (!aiAnalysis) {
    const errorResponse = handleError(
      new ValidationError("AI analysis not found")
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }

  const analysis = aiAnalysis.analysis as unknown as AiAnalysisResponse;
  const weakTopic = analysis?.weaknessAnalysis.weakTopics.find(
    (topic) => topic.topic === topicName
  );

  const practiceProblems = await findPracticeProblems(
    topicName,
    weakTopic?.recommendedProblemRatings || [800],
    limit,
    page
  );

  return sendSuccessResponse(
    practiceProblems,
    "Practice problems fetched successfully"
  );
}
