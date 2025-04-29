import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const PerformanceAnalysisSkeleton = () => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Performance Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <Shimmer className="h-6 w-32 mb-4" />
          <Shimmer className="h-12 w-24 mb-4" />
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <Shimmer className="h-4 w-24 mb-4" />
              <Shimmer className="h-8 w-16 mb-4" />
              <Shimmer className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceAnalysisSkeleton;
