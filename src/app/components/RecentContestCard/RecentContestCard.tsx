import React from "react";

const RecentContestCard = ({
  contest,
  setSelectedContest,
}: {
  contest: {
    id: number;
    name: string;
    date: string;
    participated: boolean;
    rating: string;
  };
  setSelectedContest: (id: string) => void;
}) => {
  return (
    <div
      key={contest.id}
      className="bg-white rounded-lg shadow-md p-4 border-l-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      style={{
        borderLeftColor: contest.rating.startsWith("+") ? "#10B981" : "#EF4444",
      }}
      onClick={() => setSelectedContest(contest.id.toString())}
    >
      <h3 className="font-semibold text-gray-800 mb-2 truncate">
        {contest.name}
      </h3>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{contest.date}</span>
        <span
          className={
            contest.rating.startsWith("+")
              ? "text-green-500 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {contest.rating}
        </span>
      </div>
    </div>
  );
};

export default RecentContestCard;
