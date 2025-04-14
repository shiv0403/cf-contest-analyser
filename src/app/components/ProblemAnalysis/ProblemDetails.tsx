import React from "react";

const ProblemDetails = ({
  problem,
}: {
  problem: {
    id: string;
    name: string;
    status: string;
    timeTaken: string;
    wrongAttempts: number;
    difficulty: number;
  };
}) => {
  return (
    <tr key={problem.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
            {problem.id}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {problem.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            problem.status === "Solved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {problem.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {problem.timeTaken}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{problem.wrongAttempts}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{problem.difficulty}</div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
          <div
            className={`h-full rounded-full ${
              problem.difficulty < 1200
                ? "bg-green-500"
                : problem.difficulty < 1800
                ? "bg-blue-500"
                : problem.difficulty < 2400
                ? "bg-purple-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${Math.min(100, (problem.difficulty / 3000) * 100)}%`,
            }}
          ></div>
        </div>
      </td>
    </tr>
  );
};

export default ProblemDetails;
