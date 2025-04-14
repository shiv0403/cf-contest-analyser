"use client";
import React, { useState } from "react";
import RecentContestCard from "../components/RecentContestCard/RecentContestCard";
import PerformanceAnalysis from "../components/PerformanceAnalysis/PerformanceAnalysis";
import ProblemAnalysis from "../components/ProblemAnalysis/ProblemAnalysis";
import AiAnalysis from "../components/AiAnalaysis/AiAnalysis";

const ContestAnalysis = () => {
  const [selectedContest, setSelectedContest] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const performanceMetrics = {
    ratingChange: +127,
    solvedProblems: 4,
    totalProblems: 6,
    averageTime: "32 min",
    successRate: "78%",
  };

  const weakTopics = [
    {
      name: "Dynamic Programming",
      proficiency: 35,
      effort: "High",
      problems: ["DP Subarray", "Knapsack Variation", "LCS Problem"],
    },
    {
      name: "Graph Algorithms",
      proficiency: 42,
      effort: "Medium",
      problems: ["DFS Application", "Shortest Path", "MST Problem"],
    },
    {
      name: "Number Theory",
      proficiency: 28,
      effort: "High",
      problems: ["Prime Factorization", "Modular Arithmetic", "GCD Problem"],
    },
  ];

  const problems = [
    {
      id: "A",
      name: "Divide and Conquer",
      status: "Solved",
      timeTaken: "12 min",
      wrongAttempts: 0,
      difficulty: 800,
    },
    {
      id: "B",
      name: "Balanced Substring",
      status: "Solved",
      timeTaken: "24 min",
      wrongAttempts: 1,
      difficulty: 1100,
    },
    {
      id: "C",
      name: "Cyclic Permutations",
      status: "Solved",
      timeTaken: "45 min",
      wrongAttempts: 2,
      difficulty: 1400,
    },
    {
      id: "D",
      name: "Tree Queries",
      status: "Solved",
      timeTaken: "52 min",
      wrongAttempts: 0,
      difficulty: 1700,
    },
    {
      id: "E",
      name: "Divisibility Problem",
      status: "Unsolved",
      timeTaken: "-",
      wrongAttempts: 3,
      difficulty: 2100,
    },
    {
      id: "F",
      name: "Graph Coloring",
      status: "Unsolved",
      timeTaken: "-",
      wrongAttempts: 0,
      difficulty: 2400,
    },
  ];

  const recentContests = [
    {
      id: 1,
      name: "Codeforces Round #835 (Div. 2)",
      date: "April 10, 2025",
      participated: true,
      rating: "+127",
    },
    {
      id: 2,
      name: "Codeforces Round #834 (Div. 1)",
      date: "April 5, 2025",
      participated: true,
      rating: "-42",
    },
    {
      id: 3,
      name: "Educational Codeforces Round 156",
      date: "March 28, 2025",
      participated: true,
      rating: "+65",
    },
    {
      id: 4,
      name: "Codeforces Round #833 (Div. 2)",
      date: "March 20, 2025",
      participated: true,
      rating: "+15",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Select Contest
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap cursor-pointer ${
                timeFilter === "month"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setTimeFilter("3months")}
              className={`px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap cursor-pointer ${
                timeFilter === "3months"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setTimeFilter("6months")}
              className={`px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap cursor-pointer ${
                timeFilter === "6months"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap cursor-pointer ${
                timeFilter === "all"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        <div className="relative mb-8">
          <select
            value={selectedContest}
            onChange={(e) => setSelectedContest(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"
          >
            <option value="">Select a contest...</option>
            {recentContests.map((contest) => (
              <option key={contest.id} value={contest.id}>
                {contest.name} ({contest.date})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentContests.map((contest) => (
            <RecentContestCard
              key={contest.id}
              contest={contest}
              setSelectedContest={setSelectedContest}
            />
          ))}
        </div>
      </section>

      {/* Performace analysis */}
      <PerformanceAnalysis performanceMetrics={performanceMetrics} />

      {/* Problem analysis */}
      <ProblemAnalysis problems={problems} />

      {/* AI Analysis */}
      <AiAnalysis weakTopics={weakTopics} />
    </div>
  );
};

export default ContestAnalysis;
