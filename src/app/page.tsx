"use client";
import React, { useEffect, useState } from "react";
import RecentContestCard from "./components/RecentContestCard/RecentContestCard";
import PerformanceAnalysis from "./components/PerformanceAnalysis/PerformanceAnalysis";
import ProblemAnalysis from "./components/ProblemAnalysis/ProblemAnalysis";
import PerformanceAnalysisSkeleton from "./components/PerformanceAnalysis/PerformanceAnalysisSkeleton";
import ProblemAnalysisSkeleton from "./components/ProblemAnalysis/ProblemAnalysisSkeleton";
import ContestSelectionSkeleton from "./components/ContestSelection/ContestSelectionSkeleton";
import HandleInput from "./components/HandleInput/HandleInput";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";
import {
  PerformanceMetrics,
  ProblemAnalysisType,
  UserContest,
} from "./types/contest.types";

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

export default function Home() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [selectedContest, setSelectedContest] = useState<UserContest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [userHandle, setUserHandle] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const [userContests, setUserContests] = useState<Array<Contest>>([]);
  const [problemAnalysis, setProblemAnalysis] =
    useState<ProblemAnalysisType[]>();
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>();

  // Initialize userHandle from auth context
  useEffect(() => {
    if (user?.userHandle) {
      setUserHandle(user.userHandle);
      setHasSearched(true);
      fetchUserContests();
    }
  }, [user]);

  const fetchUserContests = async () => {
    const handle = user?.userHandle || userHandle;
    if (!handle) return;

    setIsInitialLoading(true);
    try {
      const response = await fetch(`/api/userContests?userHandle=${handle}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to fetch user contests"
        );
      }
      const { data } = await response.json();
      setUserContests(data || []);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to fetch user contests",
        "error"
      );
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchContestDetails = async (contestId: number) => {
    const handle = user?.userHandle || userHandle;
    if (!handle) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/userSubmissions?contestId=${contestId}&userHandle=${handle}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to fetch contest details"
        );
      }
      const { data } = await response.json();
      setProblemAnalysis(data.problemAnalysis);
      setPerformanceMetrics(data.performanceMetrics);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to fetch contest details",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedContest) {
      fetchContestDetails(selectedContest.contestId);
    }
  }, [selectedContest]);

  const handleSearch = () => {
    if (userHandle.trim()) {
      setUserContests([]);
      setSelectedContest(null);
      setPerformanceMetrics(undefined);
      setProblemAnalysis(undefined);
      setHasSearched(true);
      fetchUserContests();
    }
  };

  const recentContests: Array<Contest> = userContests.slice(-4);

  if (isAuthLoading) {
    return <ContestSelectionSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        {!isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <HandleInput
                  handle={userHandle}
                  setHandle={setUserHandle}
                  isLoading={isInitialLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!userHandle.trim() || isInitialLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
              >
                {isInitialLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        )}

        {isAuthenticated && userHandle && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Viewing contests for:</span>
              <span className="font-medium text-gray-800">{userHandle}</span>
            </div>
          </div>
        )}

        {!hasSearched && !isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <i className="fas fa-chart-line text-red-600 text-4xl"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Start analyzing contests
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Enter a Codeforces handle to analyze contest performance,
              problem-solving patterns, and rating trends.
            </p>
          </div>
        )}

        {hasSearched && isInitialLoading ? (
          <ContestSelectionSkeleton />
        ) : hasSearched && userHandle ? (
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
                className="w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 text-sm"
              >
                <option value="">Select a contest...</option>
                {userContests.map((contest) => (
                  <option key={contest.contestId} value={contest.contestId}>
                    {contest.contestName} ({contest.date})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                <i className="fas fa-chevron-down text-sm"></i>
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
        ) : null}

        {/* Performance analysis */}
        {isLoading ? (
          <PerformanceAnalysisSkeleton />
        ) : (
          performanceMetrics && (
            <PerformanceAnalysis performanceMetrics={performanceMetrics} />
          )
        )}

        {/* Problem analysis */}
        {isLoading ? (
          <ProblemAnalysisSkeleton />
        ) : (
          problemAnalysis && <ProblemAnalysis problems={problemAnalysis} />
        )}
      </div>
    </div>
  );
}
