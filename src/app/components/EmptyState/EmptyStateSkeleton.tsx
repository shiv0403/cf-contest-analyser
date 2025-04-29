import React from "react";
import Shimmer from "../Shimmer/Shimmer";

const EmptyStateSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-6 overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-8 w-48 mx-auto mb-2 bg-gray-100 rounded-md overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-4 w-64 mx-auto mb-6 bg-gray-100 rounded-md overflow-hidden">
        <Shimmer />
      </div>
    </div>
  );
};

export default EmptyStateSkeleton;
