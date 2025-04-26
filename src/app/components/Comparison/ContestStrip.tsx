import React from "react";

type ContestStripData = {
  contestName: string;
  contestDate: string;
  userRatingChanges: string;
  compareToUserRatingChanges: string;
};

type ContestStripProps = {
  contestData: ContestStripData;
};

const ContestStrip = ({ contestData }: ContestStripProps) => {
  const getBgCssClass = (ratingChange: string) => {
    if (ratingChange.startsWith("-")) {
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
    } else {
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
        {contestData.contestName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {contestData.contestDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getBgCssClass(contestData.userRatingChanges)}>
          {contestData.userRatingChanges}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getBgCssClass(contestData.compareToUserRatingChanges)}>
          {contestData.compareToUserRatingChanges}
        </span>
      </td>
    </tr>
  );
};

export default ContestStrip;
