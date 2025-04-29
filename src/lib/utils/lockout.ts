import { Problem } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db";
import { getUserFullName } from "./user";
import { getUserRating } from "./codeforces";
import { getProblemsFromContestIdAndIndex } from "./problem";
import { UserSubmission } from "@/app/types/contest.types";
import { LockoutWithUsers } from "@/app/types/lockout";

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
        winner: true,
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
        OR: [{ hostId: userId }, { inviteeId: userId }],
      },
      include: {
        host: true,
        invitee: true,
        winner: true,
      },
    });

    return lockouts;
  } catch (error) {
    console.error("Error fetching user lockouts:", error);
    throw new Error("Failed to fetch user lockouts");
  }
};

export const createLockoutSubmissions = async (
  lockout: LockoutWithUsers,
  problemIdVsSubmissionHost: Record<number, UserSubmission>,
  problemIdVsSubmissionInvitee: Record<number, UserSubmission>
) => {
  try {
    if (
      !lockout ||
      !problemIdVsSubmissionHost ||
      !problemIdVsSubmissionInvitee
    ) {
      throw new Error("Invalid Lockout or submissions");
    }

    // for host
    const lockoutSubmissionsData = [];
    for (const problemId in problemIdVsSubmissionHost) {
      const hostSubmission = problemIdVsSubmissionHost[problemId];
      const existingSubmission = await prisma.submission.findFirst({
        where: {
          contestId: hostSubmission.contestId,
          userHandle: lockout.host.userHandle,
          problemId: parseInt(problemId),
        },
      });

      if (!existingSubmission) {
        const submission = await prisma.submission.create({
          data: {
            contestId: hostSubmission.contestId,
            problemId: parseInt(problemId),
            userHandle: lockout.host.userHandle,
            verdict: hostSubmission.verdict,
            language: hostSubmission.programmingLanguage,
            creationTimeSeconds: hostSubmission.creationTimeSeconds,
            relativeTimeSeconds: hostSubmission.relativeTimeSeconds,
            timeConsumedMillis: hostSubmission.timeConsumedMillis,
            memoryConsumedBytes: hostSubmission.memoryConsumedBytes,
          },
        });
        lockoutSubmissionsData.push({
          lockoutId: lockout.id,
          submissionId: submission.id,
          problemId: parseInt(problemId),
          userHandle: lockout.host.userHandle,
        });
      }
    }

    // for invitee
    for (const problemId in problemIdVsSubmissionInvitee) {
      const inviteeSubmission = problemIdVsSubmissionInvitee[problemId];
      const existingSubmission = await prisma.submission.findFirst({
        where: {
          contestId: inviteeSubmission.contestId,
          userHandle: lockout.invitee.userHandle,
          problemId: parseInt(problemId),
        },
      });
      if (!existingSubmission) {
        const submission = await prisma.submission.create({
          data: {
            contestId: inviteeSubmission.contestId,
            problemId: parseInt(problemId), // Use the map to get the problemId
            userHandle: lockout.invitee.userHandle,
            verdict: inviteeSubmission.verdict,
            language: inviteeSubmission.programmingLanguage,
            creationTimeSeconds: inviteeSubmission.creationTimeSeconds,
            relativeTimeSeconds: inviteeSubmission.relativeTimeSeconds,
            timeConsumedMillis: inviteeSubmission.timeConsumedMillis,
            memoryConsumedBytes: inviteeSubmission.memoryConsumedBytes,
          },
        });
        lockoutSubmissionsData.push({
          lockoutId: lockout.id,
          submissionId: submission.id,
          problemId: parseInt(problemId),
          userHandle: lockout.invitee.userHandle,
        });
      }
    }

    // bulk create lockout submissions
    await prisma.lockoutSubmission.createMany({
      data: lockoutSubmissionsData,
    });

    return true;
  } catch (error) {
    console.error("Error creating lockout submissions:", error);
    throw new Error("Failed to create lockout submissions");
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
      include: {
        host: true,
        winner: true,
        invitee: true,
      },
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

export const getAcceptedLockout = async (lockoutId: number) => {
  try {
    const lockout = await prisma.lockout.findUnique({
      where: {
        id: lockoutId,
      },
      include: {
        host: true,
        invitee: true,
        winner: true,
        LockoutSubmissions: {
          include: {
            submission: {
              include: {
                problem: true,
              },
            },
          },
        },
      },
    });
    if (!lockout) {
      throw new Error("Lockout not found");
    }

    const lockoutProblems = await prisma.problem.findMany({
      where: {
        id: {
          in: lockout.problemIds,
        },
      },
    });
    const problems = lockoutProblems.map((problem) => ({
      id: problem.id,
      name: problem.name,
      link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    }));
    return { lockout, problems };
  } catch (error) {
    console.error("Error fetching lockout:", error);
    throw new Error("Failed to fetch lockout");
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
      include: {
        host: true,
        invitee: true,
        winner: true,
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

export const evaluateLockoutWinner = async (lockoutId: number) => {
  try {
    const lockout = await prisma.lockout.findFirst({
      where: {
        id: lockoutId,
      },
      include: {
        host: true,
        invitee: true,
        LockoutSubmissions: {
          include: {
            submission: true,
          },
        },
      },
    });

    if (!lockout) {
      throw new Error(`Lockout with id: ${lockoutId} not found`);
    }

    const lockoutSubmissions = lockout.LockoutSubmissions;
    if (lockoutSubmissions.length > 0) {
      const hostSubmissions = lockoutSubmissions.filter(
        (sb) => sb.submission.userHandle === lockout.host.userHandle
      );
      const inviteeSubmissions = lockoutSubmissions.filter(
        (sb) => sb.submission.userHandle === lockout.invitee.userHandle
      );

      // No winner
      if (hostSubmissions.length === 0 && inviteeSubmissions.length === 0) {
        return false;
      }

      let winnerId = -1;
      if (hostSubmissions.length === inviteeSubmissions.length) {
        // find the fastest completion time
        const hostMaxTime = Math.max(
          ...hostSubmissions.map((sb) => sb.submission.creationTimeSeconds)
        );
        const inviteeMaxTime = Math.max(
          ...inviteeSubmissions.map((sb) => sb.submission.creationTimeSeconds)
        );

        if (hostMaxTime > inviteeMaxTime) {
          winnerId = lockout.inviteeId;
        } else if (hostMaxTime < inviteeMaxTime) {
          winnerId = lockout.hostId;
        }
      } else if (hostSubmissions.length > inviteeSubmissions.length) {
        winnerId = lockout.hostId;
      } else if (hostSubmissions.length < inviteeSubmissions.length) {
        winnerId = lockout.inviteeId;
      }

      if (winnerId !== -1) {
        await prisma.lockout.update({
          where: {
            id: lockoutId,
          },
          data: {
            winnerId,
            status: "completed",
          },
        });
      } else {
        return false;
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Failed to evaluate lockout winner", error);
    throw new Error(`Failed to evaluate lockout ${lockoutId} winner`);
  }
};
