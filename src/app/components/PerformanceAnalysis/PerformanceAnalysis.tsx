import { PerformanceMetrics } from "@/app/types/contest.types";
import React from "react";

const PerformanceAnalysisCard = ({
  performanceMetrics,
}: {
  performanceMetrics: PerformanceMetrics;
}) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Performance Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Rating Change
          </h3>
          <div
            className={`text-5xl font-bold mb-4 ${
              performanceMetrics.ratingChange.startsWith("+")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {performanceMetrics.ratingChange}
          </div>
          <div className="w-full h-10 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Problems Solved
            </h3>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-800">
                {performanceMetrics.problemsSolved}/
                {performanceMetrics.totalProblems}
              </div>
              <div className="text-lg font-medium text-green-500">
                {Math.round(
                  (performanceMetrics.problemsSolved /
                    performanceMetrics.totalProblems) *
                    100
                )}
                %
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    (performanceMetrics.problemsSolved /
                      performanceMetrics.totalProblems) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Average Time
            </h3>
            <div className="flex items-center">
              <i className="fas fa-clock text-blue-500 mr-2"></i>
              <div className="text-3xl font-bold text-gray-800">
                {performanceMetrics.avgTimePerProblem}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-3">per solved problem</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Success Rate
            </h3>
            <div className="text-3xl font-bold text-gray-800">
              {performanceMetrics.successRate}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: performanceMetrics.successRate }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceAnalysisCard;
