import React from "react";
import ProblemDetails from "./ProblemDetails";

const ProblemAnalysis = ({
  problems,
}: {
  problems: Array<{
    id: string;
    name: string;
    status: string;
    timeTaken: string;
    wrongAttempts: number;
    difficulty: number;
  }>;
}) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Problem Analysis
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Problem
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time Taken
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Wrong Attempts
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <ProblemDetails key={problem.id} problem={problem} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProblemAnalysis;
