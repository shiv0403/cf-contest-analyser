import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const AiAnalysisSkeleton = () => {
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
          <div className="h-10 w-32 bg-gray-100 rounded-md overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>

      {/* Analysis Content Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Overview Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <Shimmer />
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-md overflow-hidden mb-2">
              <Shimmer />
            </div>
            <div className="h-4 w-3/4 bg-gray-100 rounded-md overflow-hidden">
              <Shimmer />
            </div>
          </div>

          {/* Strengths Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <Shimmer />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="h-20 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Shimmer />
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <Shimmer />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="h-20 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Shimmer />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <Shimmer />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Shimmer />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisSkeleton;
