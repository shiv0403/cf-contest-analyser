/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const LockoutProblemDetails = ({ problem, lockout, index }: any) => {
  return (
    <tr key={problem.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
            {index + 1}
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
            problem.submissions[0]?.verdict === "OK"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {problem.submissions[0]?.verdict ?? "Unsolved"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {problem.submissions.length > 0 ? (
          <span>{`${Math.ceil(
            (problem.submissions[0]?.creationTimeSeconds - lockout.startTime) /
              60
          )} mins`}</span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {problem.submissions.length > 1 ? (
          <span>{`${Math.ceil(
            (problem.submissions[1]?.creationTimeSeconds - lockout.startTime) /
              60
          )} mins`}</span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{"27/04/2025"}</div>
      </td>
    </tr>
  );
};

export default LockoutProblemDetails;
