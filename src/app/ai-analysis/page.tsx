"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AiAnalysisResponse } from "@/app/types/ai-analysis";
import AiAnalysis from "../components/AiAnalaysis/AiAnalysis";
import AiAnalysisSkeleton from "../components/AiAnalaysis/AiAnalysisSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";

export default function AiAnalysisPage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResponse | null>(null);

  const handleAnalyze = useCallback(
    async (reanalyze: boolean = false) => {
      if (!user?.userHandle) return;

      setLoading(true);

      try {
        const response = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.userHandle, reanalyze }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || "Failed to generate AI analysis"
          );
        }

        const { data: analysisData } = await response.json();
        setAnalysis(analysisData);
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Failed to generate AI analysis",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.userHandle, showToast]
  );

  const getAiAnalysis = useCallback(async () => {
    if (!user?.userHandle) return;
    const response = await fetch(
      `/api/ai-analysis?userHandle=${user?.userHandle}`
    );
    const { data } = await response.json();
    setAnalysis(data);
  }, [user]);

  useEffect(() => {
    getAiAnalysis();
  }, [getAiAnalysis]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">
              Get personalized insights and recommendations for improving your
              competitive programming skills
            </p>
          </div>
          {analysis && (
            <button
              onClick={() => handleAnalyze(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium inline-flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Re-analyzing...
                </span>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Re-analyze
                </>
              )}
            </button>
          )}
        </div>

        {loading && <AiAnalysisSkeleton />}
        {!loading && !analysis && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ready for Your AI Analysis?
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Get a detailed analysis of your Codeforces performance, including
              strengths, weaknesses, and personalized recommendations for
              improvement.
            </p>
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !isAuthenticated}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium inline-flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Analyzing...
                </span>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Start Analysis
                </>
              )}
            </button>
          </div>
        )}
        {!loading && analysis && <AiAnalysis analysis={analysis} />}
      </div>
    </div>
  );
}
