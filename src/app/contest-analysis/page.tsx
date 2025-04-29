"use client";
import React, { useEffect, useState } from "react";
import RecentContestCard from "../components/RecentContestCard/RecentContestCard";
import PerformanceAnalysis from "../components/PerformanceAnalysis/PerformanceAnalysis";
import ProblemAnalysis from "../components/ProblemAnalysis/ProblemAnalysis";
// import AiAnalysis from "../components/AiAnalaysis/AiAnalysis";
import {
  PerformanceMetrics,
  ProblemAnalysisType,
  UserContest,
} from "../types/contest.types";

type Contest = {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
  date: string;
};

const ContestAnalysis = () => {
  const [selectedContest, setSelectedContest] = useState<UserContest | null>(
    null
  );

  const userHandle = "swapniltyagi";
  const [userContests, setUserContests] = useState<Array<Contest>>([]);
  const [problemAnalysis, setProblemAnalysis] =
    useState<ProblemAnalysisType[]>();
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>();

  const fetchUserContests = async () => {
    try {
      const response = await fetch(
        `/api/userContests?userHandle=${userHandle}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user contests");
      }
      const data = await response.json();
      setUserContests(data || []);
    } catch (error) {
      console.error("Error fetching user contests:", error);
    }
  };

  const fetchContestDetails = async (contestId: number) => {
    try {
      const response = await fetch(
        `/api/userSubmissions?contestId=${contestId}&userHandle=${userHandle}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contest details");
      }
      const data = await response.json();
      setProblemAnalysis(data.problemAnalysis);
      setPerformanceMetrics(data.performanceMetrics);
    } catch (error) {
      console.error("Error fetching contest details:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUserContests();
  }, [userHandle]);

  useEffect(() => {
    if (selectedContest) {
      fetchContestDetails(selectedContest.contestId);
    }
  }, [selectedContest]);

  const recentContests: Array<Contest> = userContests.slice(-4);

  console.log({ selectedContest });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Select Contest
          </h2>
        </div>
        <div className="relative mb-8">
          <select
            value={selectedContest?.contestId}
            onChange={(e) => {
              const selectedContestId = parseInt(e.target.value);
              const contest = userContests.find(
                (c) => c.contestId === selectedContestId
              );
              setSelectedContest(contest || null);
            }}
            className="w-full md:w-1/2 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"
          >
            <option value="">Select a contest...</option>
            {userContests.map((contest) => (
              <option key={contest.contestId} value={contest.contestId}>
                {contest.contestName} ({contest.date})
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
              key={contest.contestId}
              contest={contest}
              setSelectedContest={setSelectedContest}
            />
          ))}
        </div>
      </section>

      {/* Performace analysis */}
      {performanceMetrics && (
        <PerformanceAnalysis performanceMetrics={performanceMetrics} />
      )}

      {/* Problem analysis */}
      {problemAnalysis && <ProblemAnalysis problems={problemAnalysis} />}
    </div>
  );
};

export default ContestAnalysis;
