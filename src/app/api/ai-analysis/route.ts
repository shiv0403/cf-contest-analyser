import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserDataForAiAnalysis } from "@/lib/utils/aiAnalysis";
import {
  handleError,
  InternalServerError,
  ValidationError,
} from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";
import { getJwtToken } from "@/lib/utils/auth";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

interface UserProfileData {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  contribution?: number;
  registrationTimeSeconds: number;
}

interface PerformanceMetricsData {
  totalProblems: number;
  problemsSolved: number;
  successRate: number;
  avgTimePerProblem: number;
  activeLastMonth: boolean;
  monthlyActivity: number;
  recentProblemsSolved: number;
  recentTopicsCovered: number;
}

interface ProblemSolvingPatternsData {
  preferredTopics: string[];
  ratingDistribution: Record<string, number>;
  verdictDistribution: Record<string, number>;
  preferredLanguages: string[];
}

export async function POST(request: NextRequest) {
  try {
    const token = await getJwtToken(request);

    const data = await request.json();
    const userHandle = data.username;
    const reanalyze = data.reanalyze;

    if (!userHandle) {
      throw new ValidationError("User handle is required");
    }

    // Verify that the authenticated user is requesting their own data
    if (token?.userHandle !== userHandle) {
      throw new ValidationError(
        "You can only request analysis for your own handle"
      );
    }

    const currentAIAnalysis = await prisma.aiAnalysis.findFirst({
      where: {
        userHandle: userHandle,
      },
    });

    if (!currentAIAnalysis) {
      const { userProfile, performanceMetrics, problemSolvingPatterns } =
        await getUserDataForAiAnalysis(userHandle);
      const analysis = await getAiAnalysis(
        userProfile,
        performanceMetrics,
        problemSolvingPatterns
      );

      await prisma.aiAnalysis.create({
        data: {
          userHandle: userHandle,
          analysis: analysis,
        },
      });
    } else if (
      currentAIAnalysis.updatedAt <
        new Date(Date.now() - 24 * 60 * 60 * 1000) &&
      reanalyze
    ) {
      const { userProfile, performanceMetrics, problemSolvingPatterns } =
        await getUserDataForAiAnalysis(userHandle);
      const analysis = await getAiAnalysis(
        userProfile,
        performanceMetrics,
        problemSolvingPatterns
      );

      await prisma.aiAnalysis.update({
        where: {
          id: currentAIAnalysis.id,
        },
        data: {
          analysis: analysis,
        },
      });
    } else if (reanalyze) {
      throw new ValidationError("You can only re-analyze once per day");
    }

    const latestAIAnalysis = await prisma.aiAnalysis.findFirst({
      where: {
        userHandle: userHandle,
      },
    });

    return sendSuccessResponse(
      latestAIAnalysis?.analysis,
      "AI analysis generated successfully"
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getJwtToken(request);
    const userHandle = request.nextUrl.searchParams.get("userHandle");

    if (!userHandle) {
      throw new ValidationError("User handle is required");
    }

    if (token?.userHandle !== userHandle) {
      throw new ValidationError(
        "You can only request analysis for your own handle"
      );
    }

    const aiAnalysis = await prisma.aiAnalysis.findFirst({
      where: {
        userHandle: userHandle,
      },
    });

    return sendSuccessResponse(
      aiAnalysis?.analysis,
      "AI analysis fetched successfully"
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}

async function getAiAnalysis(
  userProfile: UserProfileData,
  performanceMetrics: PerformanceMetricsData,
  problemSolvingPatterns: ProblemSolvingPatternsData
) {
  const prompt = `You are an expert competitive programming coach analyzing a Codeforces user's performance. Based on the provided data, generate a comprehensive analysis that will help the user improve their competitive programming skills.

User Profile and Performance Data:
${JSON.stringify(
  { userProfile, performanceMetrics, problemSolvingPatterns },
  null,
  2
)}

Please provide a detailed analysis in JSON format with the following structure:
{
  "strengthAnalysis": {
    "strongTopics": [
      {
        "topic": string,
        "proficiency": number (0-100),
        "evidence": string (explanation of why this is a strength)
      }
    ],
    "consistentPatterns": [string] (list of positive patterns observed)
  },
  "weaknessAnalysis": {
    "weakTopics": [
      {
        "topic": string,
        "proficiency": number (0-100),
        "suggestedApproach": string,
        "recommendedProblemRatings": [number] (list of problem ratings for the user to practice acc. to user's proficiency and current rating)
      }
    ],
    "improvementAreas": [string] (list of areas needing immediate attention)
  },
  "practiceStrategy": {
    "dailyRoutine": [string] (specific daily practice steps),
    "weeklyGoals": [string],
    "topicWisePlan": [
      {
        "topic": string,
        "timeAllocation": string,
        "resourceLinks": [string],
        "practiceApproach": string
      }
    ]
  },
  "contestStrategy": {
    "preparationTips": [string],
    "duringContestAdvice": [string],
    "postContestLearning": [string]
  },
  "timeManagement": {
    "problemSolvingTimeBreakdown": {
      "reading": string (suggested time),
      "thinking": string,
      "coding": string,
      "testing": string
    },
    "practiceSchedule": {
      "weekday": [string],
      "weekend": [string]
    }
  },
  "nextMilestones": {
    "shortTerm": [
      {
        "goal": string,
        "timeframe": string,
        "actionItems": [string]
      }
    ],
    "longTerm": [
      {
        "goal": string,
        "timeframe": string,
        "prerequisites": [string]
      }
    ]
  }
}

Analysis Guidelines:
1. Focus on actionable insights based on the user's current performance
2. Consider their success rate and time distribution patterns
3. Analyze their topic-wise performance to identify knowledge gaps
4. Suggest realistic time management strategies based on their current activity patterns
5. Set achievable milestones based on their current rating and progress rate

Format your response as a valid JSON object without any additional text or explanations.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanText = text
      .replace(/```json|```/g, "")
      .replace(/\\n/g, "")
      .replace(/\s*\+\s*/g, "")
      .replace(/^'|';?$/g, "");

    const analysis = JSON.parse(cleanText);

    return analysis;
  } catch (error) {
    throw new InternalServerError(`Failed to generate AI analysis: ${error}`);
  }
}
