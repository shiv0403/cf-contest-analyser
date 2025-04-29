export type ProblemTag = {
  name: string;
  count: number;
  successRate: number;
};

export interface StrongTopic {
  topic: string;
  proficiency: number;
  evidence: string;
}

export interface WeakTopic {
  topic: string;
  proficiency: number;
  suggestedApproach: string;
  recommendedProblems: {
    name: string;
    difficulty: string;
    link: string;
    conceptsCovered: string[];
  }[];
}

export interface TopicWisePlan {
  topic: string;
  timeAllocation: string;
  resourceLinks: string[];
  practiceApproach: string;
}

export interface ShortTermGoal {
  goal: string;
  timeframe: string;
  actionItems: string[];
}

export interface LongTermGoal {
  goal: string;
  timeframe: string;
  prerequisites: string[];
}

export interface UserProfile {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  registrationTime: string;
  lastOnlineTime: string;
}

export interface PerformanceMetrics {
  ratingChange: number;
  problemsSolved: number;
  totalProblems: number;
  avgTimePerProblem: number;
  successRate: number;
  contestParticipation: number;
  averageContestRank: number;
  maxStreak: number;
  currentStreak: number;
}

export interface ProblemSolvingPatterns {
  preferredDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  topicDistribution: {
    [topic: string]: number;
  };
  averageTimeToSolve: {
    easy: number;
    medium: number;
    hard: number;
  };
  submissionPattern: {
    firstTrySuccess: number;
    multipleAttempts: number;
    compilationError: number;
    runtimeError: number;
    wrongAnswer: number;
  };
}

export interface AiAnalysisResponse {
  strengthAnalysis: {
    strongTopics: StrongTopic[];
    consistentPatterns: string[];
  };
  weaknessAnalysis: {
    weakTopics: WeakTopic[];
    improvementAreas: string[];
  };
  practiceStrategy: {
    dailyRoutine: string[];
    weeklyGoals: string[];
    topicWisePlan: TopicWisePlan[];
  };
  contestStrategy: {
    preparationTips: string[];
    duringContestAdvice: string[];
    postContestLearning: string[];
  };
  timeManagement: {
    problemSolvingTimeBreakdown: {
      reading: string;
      thinking: string;
      coding: string;
      testing: string;
    };
    practiceSchedule: {
      weekday: string[];
      weekend: string[];
    };
  };
  nextMilestones: {
    shortTerm: ShortTermGoal[];
    longTerm: LongTermGoal[];
  };
}
