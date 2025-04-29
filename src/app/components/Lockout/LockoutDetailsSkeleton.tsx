import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const LockoutDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-48 bg-gray-100 rounded-md overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-6 w-24 bg-gray-100 rounded-full overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden">
              <Shimmer />
            </div>
          </div>
        </div>

        {/* User Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[1, 2].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full overflow-hidden">
                  <Shimmer />
                </div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-100 rounded-md overflow-hidden mb-1">
                    <Shimmer />
                  </div>
                  <div className="h-3 w-16 bg-gray-100 rounded-md overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Problem Name",
                  "Status",
                  "Host",
                  "Opponent",
                  "Solved At",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="h-4 w-24 bg-gray-100 rounded-md overflow-hidden">
                      <Shimmer />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((index) => (
                <tr key={index}>
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <td key={cell} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-100 rounded-md overflow-hidden">
                        <Shimmer />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LockoutDetailsSkeleton;
