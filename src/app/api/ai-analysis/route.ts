import { NextRequest } from "next/server";
import { AiAnalysisResponse } from "@/app/types/ai-analysis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db";
import { PerformanceMetrics, UserSubmission } from "@/app/types/contest.types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { submissions, performanceMetrics } = data.userData;
    const userHandle = data.username;

    const currentAIAnalysis = await prisma.aiAnalysis.findFirst({
      where: {
        userHandle: userHandle,
      },
    });

    if (!currentAIAnalysis) {
      const latestAIAnalysis = await getAiAnalysis(
        performanceMetrics,
        submissions
      );

      await prisma.aiAnalysis.create({
        data: {
          userHandle: userHandle,
          insights: latestAIAnalysis.insights || {},
          improvementPlan: latestAIAnalysis.improvementPlan || {},
          recommendedProblems: latestAIAnalysis.recommendedProblems || {},
          weakTopics: latestAIAnalysis.weakTopics || {},
        },
      });
    } else if (
      currentAIAnalysis.updatedAt < new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      const latestAIAnalysis = await getAiAnalysis(
        performanceMetrics,
        submissions
      );

      await prisma.aiAnalysis.update({
        where: {
          id: currentAIAnalysis.id,
        },
        data: {
          insights: latestAIAnalysis.insights || {},
          improvementPlan: latestAIAnalysis.improvementPlan || {},
          recommendedProblems: latestAIAnalysis.recommendedProblems || {},
          weakTopics: latestAIAnalysis.weakTopics || {},
        },
      });
    }

    const latestAIAnalysis = await prisma.aiAnalysis.findFirst({
      where: {
        userHandle: userHandle,
      },
    });

    return new Response(JSON.stringify(latestAIAnalysis));
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate AI analysis", status: 500 })
    );
  }
}

async function getAiAnalysis(
  performanceMetrics: PerformanceMetrics,
  submissions: Array<UserSubmission>
) {
  const prompt = `Analyze the following Codeforces user data and provide a detailed analysis in JSON format:
    
  Performance Metrics:
  - Rating Change: ${performanceMetrics.ratingChange}
  - Problems Solved: ${performanceMetrics.problemsSolved}
  - Total Problems: ${performanceMetrics.totalProblems}
  - Average Time per Problem: ${performanceMetrics.avgTimePerProblem} minutes
  - Success Rate: ${performanceMetrics.successRate}%

  Submissions Data:
  ${JSON.stringify(submissions, null, 2)}

  Please provide a JSON response with the following structure:
  {
    "weakTopics": [
      {
        "name": "topic name",
        "proficiency": number (0-100),
        "effort": "low/medium/high",
        "problems": ["problem link 1", "problem link 2", "problem link 3"]
      }
    ],
    "recommendedProblems": [
      {
        "topic": "topic name",
        "problems": [
          {
            "name": "problem name",
            "link": "problem link",
            "difficulty": "Easy/Medium/Hard",
            "tags": ["tag1", "tag2"]
          }
        ]
      }
    ],
    "insights": ["insight 1", "insight 2"],
    "improvementPlan": {
      "shortTerm": ["goal 1", "goal 2"],
      "longTerm": ["goal 1", "goal 2"]
    }
  }

  Focus on:
  1. Identifying weak topics with accurate proficiency levels
  2. Recommending relevant Codeforces problems for each weak topic. Problems link should be correct and recommended problems should be of appropriate difficulty level. Suggest a few problems with a little more difficuly level also. Recommend 8 problems for each topic with increasing difficulty level but not much higher than the user's current rating. Diff can be atmost 200 rating points. 3 easy, 3 medium and 2 hard problems.
  3. Providing specific insights about the user's performance. Insights should be like you are telling the user about their performance and not mentioning the word user instead.
  4. Creating a detailed improvement plan in a way that you are telling to user. Don't use the words like "the user", "user". Instead use "you"`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = response.text();
  const cleanText = text
    .replace(/```json|```/g, "") // remove markdown code block markers
    .replace(/\\n/g, "") // remove escaped newlines
    .replace(/\s*\+\s*/g, "") // remove string concatenation symbols and extra spaces
    .replace(/^'|';?$/g, ""); // remove outer single quotes or trailing semicolon
  console.log({ cleanText });
  const analysis = JSON.parse(cleanText) as AiAnalysisResponse;
  return analysis;
}
