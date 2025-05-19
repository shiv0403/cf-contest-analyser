import React from "react";

const shimmer =
  "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

const AiAnalysisSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-100 rounded-md overflow-hidden mb-2">
          <div className={`h-8 w-48 ${shimmer} rounded-lg`}></div>
        </div>
        <div className="h-4 w-64 bg-gray-100 rounded-md overflow-hidden">
          <div className={`h-4 w-64 ${shimmer} rounded-lg`}></div>
        </div>
      </div>

      {/* Search Section Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-100 rounded-md overflow-hidden mb-2">
              <div className={`h-4 w-24 ${shimmer} rounded-lg`}></div>
            </div>
            <div className="h-10 bg-gray-100 rounded-md overflow-hidden">
              <div className={`h-10 ${shimmer} rounded-lg`}></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-100 rounded-md overflow-hidden">
            <div className={`h-10 w-32 ${shimmer} rounded-lg`}></div>
          </div>
        </div>
      </div>

      {/* Analysis Content Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Overview Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <div className={`h-6 w-32 ${shimmer} rounded-lg`}></div>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-md overflow-hidden mb-2">
              <div className={`h-4 w-full ${shimmer} rounded-lg`}></div>
            </div>
            <div className="h-4 w-3/4 bg-gray-100 rounded-md overflow-hidden">
              <div className={`h-4 w-3/4 ${shimmer} rounded-lg`}></div>
            </div>
          </div>

          {/* Strengths Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${shimmer}`}></div>
              <div className={`h-8 w-32 ${shimmer} rounded-lg`}></div>
            </div>
            <div className="space-y-4">
              <div className={`h-6 w-48 ${shimmer} rounded-lg`}></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div
                      className={`h-5 w-3/4 ${shimmer} rounded-lg mb-3`}
                    ></div>
                    <div
                      className={`h-4 w-1/4 ${shimmer} rounded-lg mb-2`}
                    ></div>
                    <div className={`h-12 w-full ${shimmer} rounded-lg`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weaknesses Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${shimmer}`}></div>
              <div className={`h-8 w-48 ${shimmer} rounded-lg`}></div>
            </div>
            <div className="space-y-4">
              <div className={`h-6 w-48 ${shimmer} rounded-lg`}></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div
                      className={`h-5 w-3/4 ${shimmer} rounded-lg mb-3`}
                    ></div>
                    <div
                      className={`h-4 w-1/4 ${shimmer} rounded-lg mb-2`}
                    ></div>
                    <div className={`h-12 w-full ${shimmer} rounded-lg`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded-md overflow-hidden mb-4">
              <div className={`h-6 w-32 ${shimmer} rounded-lg`}></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <div className={`h-16 ${shimmer} rounded-lg`}></div>
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
