import React from "react";

const RecentContestCard = ({
  contest,
  setSelectedContest,
}: {
  contest: {
    contestId: number;
    contestName: string;
    handle: string;
    rank: number;
    ratingUpdateTimeSeconds: number;
    oldRating: number;
    newRating: number;
    date: string;
  };
  setSelectedContest: (id: string) => void;
}) => {
  const ratingChange = contest.newRating - contest.oldRating;
  const ratingChangeSign = ratingChange > 0 ? "+" : "-";
  const displayRatingChange =
    ratingChangeSign + Math.abs(ratingChange).toString();

  return (
    <div
      key={contest.contestId}
      className="bg-white rounded-lg shadow-md p-4 border-l-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      style={{
        borderLeftColor: ratingChangeSign.startsWith("+")
          ? "#10B981"
          : "#EF4444",
      }}
      onClick={() => setSelectedContest(contest.contestId.toString())}
    >
      <h3 className="font-semibold text-gray-800 mb-2 truncate">
        {contest.contestName}
      </h3>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{contest?.date}</span>
        <span
          className={
            ratingChangeSign.startsWith("+")
              ? "text-green-500 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {displayRatingChange}
        </span>
      </div>
    </div>
  );
};

export default RecentContestCard;
