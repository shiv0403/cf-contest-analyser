import React from "react";
import { AiAnalysisResponse } from "@/app/types/ai-analysis";

interface AiAnalysisProps {
  analysis: AiAnalysisResponse;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 p-6">
      {/* Performance Metrics */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Rating Change</h3>
            <p className="text-2xl font-bold">
              {analysis.performanceMetrics.ratingChange}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Problems Solved</h3>
            <p className="text-2xl font-bold">
              {analysis.performanceMetrics.problemsSolved}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Success Rate</h3>
            <p className="text-2xl font-bold">
              {analysis.performanceMetrics.successRate}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Avg Time/Problem</h3>
            <p className="text-2xl font-bold">
              {analysis.performanceMetrics.avgTimePerProblem}m
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500">Total Problems</h3>
            <p className="text-2xl font-bold">
              {analysis.performanceMetrics.totalProblems}
            </p>
          </div>
        </div>
      </section>

      {/* Weak Topics */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Weak Topics</h2>
        <div className="space-y-4">
          {analysis.weakTopics.map((topic, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{topic.name}</h3>
                <span className="text-sm text-gray-500">
                  Proficiency: {topic.proficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${topic.proficiency}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Effort needed: {topic.effort}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Problems */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Recommended Problems</h2>
        <div className="space-y-6">
          {analysis.recommendedProblems.map((topic, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-3">{topic.topic}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.problems.map((problem, pIndex) => (
                  <a
                    key={pIndex}
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium">{problem.name}</h4>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {problem.tags.map((tag, tIndex) => (
                        <span
                          key={tIndex}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
        <ul className="list-disc list-inside space-y-2">
          {analysis.insights.map((insight, index) => (
            <li key={index} className="text-gray-700">
              {insight}
            </li>
          ))}
        </ul>
      </section>

      {/* Improvement Plan */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Improvement Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Short-term Goals</h3>
            <ul className="list-disc list-inside space-y-2">
              {analysis.improvementPlan.shortTerm.map((goal, index) => (
                <li key={index} className="text-gray-700">
                  {goal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Long-term Goals</h3>
            <ul className="list-disc list-inside space-y-2">
              {analysis.improvementPlan.longTerm.map((goal, index) => (
                <li key={index} className="text-gray-700">
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiAnalysis;
