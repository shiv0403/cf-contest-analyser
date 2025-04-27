import { Problem } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db";
import { getUserFullName } from "./user";
import { getUserRating } from "./codeforces";
import { getProblemsFromContestIdAndIndex } from "./problem";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export const getLockout = async (lockoutId: number) => {
  try {
    const lockout = await prisma.lockout.findUnique({
      where: {
        id: lockoutId,
      },
      include: {
        host: true,
        invitee: true,
      },
    });
    if (!lockout) {
      throw new Error("Lockout not found");
    }
    return lockout;
  } catch (error) {
    console.error("Error fetching lockout:", error);
    throw new Error("Failed to fetch lockout");
  }
};

export const getUserLockouts = async (userId: number) => {
  try {
    const lockouts = await prisma.lockout.findMany({
      where: {
        hostId: userId,
      },
    });

    return lockouts;
  } catch (error) {
    console.error("Error fetching user lockouts:", error);
    throw new Error("Failed to fetch user lockouts");
  }
};

export const createPendingLockout = async (
  hostId: number,
  inviteeId: number
) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [hostId, inviteeId],
        },
      },
    });

    const host = users.find((user) => user.id === hostId);
    const invitee = users.find((user) => user.id === inviteeId);

    if (!host || !invitee) {
      throw new Error("One or both users not found");
    }

    const pendingLockout = await prisma.lockout.create({
      data: {
        name: `Lockout-${getUserFullName(host)}-${getUserFullName(invitee)}`,
        hostId: host.id,
        inviteeId: invitee.id,
        inviteCode: randomString(),
        status: "invited",
      },
    });

    return pendingLockout;
  } catch (error) {
    console.error("Error creating lockout:", error);
    throw new Error("Failed to create lockout");
  }
};

export const acceptLockout = async (lockoutId: number) => {
  const { durationSeconds, problemIds } = await getLockoutData(lockoutId);
  const endTime = new Date(Date.now() + durationSeconds * 1000);
  try {
    const lockout = await prisma.lockout.update({
      where: {
        id: lockoutId,
      },
      data: {
        status: "active",
        startTime: new Date(),
        endTime: endTime,
        durationSeconds: durationSeconds,
        problemIds: problemIds,
      },
    });

    return lockout;
  } catch (error) {
    console.error("Error accepting lockout:", error);
    throw new Error("Failed to accept lockout");
  }
};

async function getLockoutData(lockoutId: number) {
  const lockout = await getLockout(lockoutId);
  const host = lockout.host;
  const invitee = lockout.invitee;

  // find the host and invitee ratings from codeforces API and then use gemini to find the 3 relevant problems for the lockout contest along with the duration of it.
  const hostRating = await getUserRating(host.userHandle);
  const inviteeRating = await getUserRating(invitee.userHandle);

  const suggestion = await suggestLockoutProblems(hostRating, inviteeRating);
  const { problems, duration } = suggestion;

  console.log({ problems, duration });

  return {
    durationSeconds: duration,
    problemIds: problems.map((problem: Problem) => problem.id),
  };
}

async function suggestLockoutProblems(
  hostRating: number,
  inviteeRating: number
) {
  const prompt = `
    Suggest 3 Codeforces problems for a lockout contest between two players.
    Host rating: ${hostRating}
    Invitee rating: ${inviteeRating}

    Rules:
    - Return only JSON.
    - JSON format:
    {
      "problems": [
        { "contestId": number, "index": "A", "link": "..." },
        { "contestId": number, "index": "B", "link": "..." },
        { "contestId": number, "index": "C", "link": "..." }
      ],
      "durationSeconds": number
    }
    - Only output JSON, no explanation or extra text.

    Make sure the problems are appropriate for their ratings.
    `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text
      .replace(/```json|```/g, "") // remove markdown code block markers
      .replace(/\\n/g, "") // remove escaped newlines
      .replace(/\s*\+\s*/g, "") // remove string concatenation symbols and extra spaces
      .replace(/^'|';?$/g, ""); // remove outer single quotes or trailing semicolon

    const lockoutData = JSON.parse(cleanText);

    const problems: Array<Problem> = await Promise.all(
      lockoutData.problems.map(
        async (problem: { contestId: number; index: string }) => {
          const p = await getProblemsFromContestIdAndIndex(
            problem.contestId,
            problem.index
          );
          return p;
        }
      )
    );
    return { problems, duration: lockoutData.durationSeconds };
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    throw new Error("AI response was not valid JSON");
  }
}

const randomString = (len = 6) =>
  [...Array(len)]
    .map(
      () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
    )
    .join("");
