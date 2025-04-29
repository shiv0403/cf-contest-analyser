import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const LockoutSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-100 rounded-md overflow-hidden mb-2">
          <Shimmer />
        </div>
        <div className="h-4 w-64 bg-gray-100 rounded-md overflow-hidden">
          <Shimmer />
        </div>
      </div>

      {/* Create Lockout Section Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-100 rounded-md overflow-hidden mb-2">
              <Shimmer />
            </div>
            <div className="h-10 bg-gray-100 rounded-md overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-100 rounded-md overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>

      {/* Lockout Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Status", "Duration", "Opponent", "Created At"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="h-4 w-20 bg-gray-100 rounded-md overflow-hidden">
                        <Shimmer />
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((index) => (
                <tr key={index}>
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <td key={cell} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-100 rounded-md overflow-hidden">
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

export default LockoutSkeleton;
