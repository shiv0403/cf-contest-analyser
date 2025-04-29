import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const ComparisonSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-100 rounded-md overflow-hidden mb-2">
            <Shimmer />
          </div>
          <div className="h-4 w-64 bg-gray-100 rounded-md overflow-hidden">
            <Shimmer />
          </div>
        </div>

        {/* Search Section Skeleton */}
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

        {/* User Profile Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-32 bg-gray-100">
                <Shimmer />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-4 w-24 bg-gray-100 rounded-md overflow-hidden mx-auto mb-2">
                        <Shimmer />
                      </div>
                      <div className="h-8 w-16 bg-gray-100 rounded-md overflow-hidden mx-auto">
                        <Shimmer />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 w-48 bg-gray-100 rounded-md overflow-hidden mb-4">
                <Shimmer />
              </div>
              <div className="h-80 bg-gray-100 rounded-md overflow-hidden">
                <Shimmer />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ComparisonSkeleton;
