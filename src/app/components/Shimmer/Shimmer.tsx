import React from "react";

interface ShimmerProps {
  className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  );
};

export default Shimmer;
