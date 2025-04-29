import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const ContestSelectionSkeleton = () => {
  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Shimmer className="h-8 w-48 mb-4 md:mb-0" />
      </div>
      <div className="relative mb-8">
        <Shimmer className="h-12 w-full md:w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <Shimmer className="h-6 w-3/4 mb-2" />
            <Shimmer className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between items-center">
              <Shimmer className="h-8 w-16" />
              <Shimmer className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContestSelectionSkeleton;
