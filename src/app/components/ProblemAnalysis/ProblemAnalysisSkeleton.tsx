import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const ProblemAnalysisSkeleton = () => {
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
                {[
                  "Problem",
                  "Status",
                  "Time Taken",
                  "Wrong Attempts",
                  "Difficulty",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shimmer className="h-8 w-8 rounded-full" />
                      <div className="ml-4">
                        <Shimmer className="h-4 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Shimmer className="h-6 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Shimmer className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Shimmer className="h-4 w-8" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Shimmer className="h-4 w-12" />
                    <Shimmer className="h-1.5 w-full mt-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProblemAnalysisSkeleton;
