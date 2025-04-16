export interface Contest {
  id: number;
  contestId: number;
  name: string;
  type: string;
  phase: string;
  frozen: string;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

export interface CfProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points: number;
  rating: number;
  tags: string[];
}

export interface CfUserContest {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface PerformanceMetrics {
  ratingChange: string;
  solvedProblems: number;
  totalProblems: number;
  averageTime: string;
  successRate: string;
}

export interface UserSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    type: string;
    points: number;
    rating: number;
    tags: string[];
  };
  author: {
    contestId: number;
    participantId: number;
    members: {
      handle: string;
    }[];
    participantType: string;
    ghost: boolean;
    room: number;
    startTimeSeconds: number;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}
