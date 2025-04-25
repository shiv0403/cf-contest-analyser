export type ProblemTag = {
  name: string;
  count: number;
  successRate: number;
};

export type WeakTopic = {
  name: string;
  proficiency: number; // 0-100
  effort: string; // 'low' | 'medium' | 'high'
  problems: Array<string>; // Problem links
};

export type PerformanceMetrics = {
  ratingChange: number;
  problemsSolved: number;
  totalProblems: number;
  avgTimePerProblem: number;
  successRate: number;
};

export type AiAnalysisResponse = {
  weakTopics: WeakTopic[];
  performanceMetrics: PerformanceMetrics;
  recommendedProblems: Array<{
    topic: string;
    problems: Array<{
      name: string;
      link: string;
      difficulty: "Easy" | "Medium" | "Hard";
      tags: string[];
    }>;
  }>;
  insights: string[];
  improvementPlan: {
    shortTerm: string[];
    longTerm: string[];
  };
};
