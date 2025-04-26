"use client";
import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { getRatingColors } from "@/lib/helpers/contestHelpers";
import ContestStrip from "../components/Comparison/ContestStrip";

type UserData = {
  username: string;
  avatar: string;
  country: string;
  rank: string;
  rating: number;
  maxRating: number;
};

type ContestPerformance = {
  contestName: string;
  contestDate: string;
  userRatingChanges: string;
  compareToUserRatingChanges: string;
};

const Comparison = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [compareWith, setCompareWith] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState<UserData>({
    username: "",
    avatar: "",
    country: "",
    rank: "",
    rating: 0,
    maxRating: 0,
  });
  const [compareUserData, setCompareUserData] = useState<UserData>({
    username: "",
    avatar: "",
    country: "",
    rank: "",
    rating: 0,
    maxRating: 0,
  });
  const [ratingChartData, setRatingChartData] = useState<
    Record<string, Record<string, Array<number>>>
  >({});
  const [contestPerformanceComparison, setContestPerformanceComparison] =
    useState<Array<ContestPerformance>>([]);
  const [difficultyChartData, setDifficultyChartData] = useState<
    Record<string, number[]>
  >({});
  const [topicProficiencyChartData, setTopicProficiencyChartData] = useState<
    Record<string, Record<string, number>>
  >({});
  const [tags, setTags] = useState<string[]>([]);

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "rating",
    "problems",
    "contests",
    "topics",
  ]);

  // Initialize rating comparison chart
  useEffect(() => {
    if (!compareWith) return;

    const chartDom = document.getElementById("rating-comparison-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const selectedData =
        ratingChartData[timeRange as keyof typeof ratingChartData] ||
        ratingChartData["6months"];

      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: function (params: any) {
            let result = selectedData.dates[params[0].dataIndex] + "<br/>";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params.forEach((param: any) => {
              result += param.seriesName + ": " + param.value + "<br/>";
            });
            return result;
          },
        },
        legend: {
          data: [currentUser.username, compareUserData.username],
          bottom: 0,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: selectedData.dates,
          axisLabel: {
            color: "#6b7280",
          },
        },
        yAxis: {
          type: "value",
          min: Math.min(...selectedData.user1, ...selectedData.user2) - 100,
          axisLabel: {
            color: "#6b7280",
          },
        },
        series: [
          {
            name: currentUser.username,
            data: selectedData.user1,
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: getRatingColors(currentUser.rating),
            },
            lineStyle: {
              width: 3,
              color: getRatingColors(currentUser.rating),
            },
          },
          {
            name: compareUserData.username,
            data: selectedData.user2,
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: getRatingColors(compareUserData.rating),
            },
            lineStyle: {
              width: 3,
              color: getRatingColors(compareUserData.rating),
            },
          },
        ],
      };

      myChart.setOption(option);

      // Resize chart on window resize
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
        myChart.dispose();
      };
    }
  }, [timeRange, ratingChartData]);

  // Initialize topic proficiency comparison chart
  useEffect(() => {
    if (!compareWith) return;

    const chartDom = document.getElementById("topic-comparison-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        animation: false,
        radar: {
          indicator: tags.map((tag) => ({
            name: tag,
            max: 100,
          })),
          radius: "65%",
          splitNumber: 4,
          axisName: {
            color: "#6b7280",
            fontSize: 12,
          },
          splitLine: {
            lineStyle: {
              color: "rgba(107, 114, 128, 0.2)",
            },
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ["rgba(255, 255, 255, 0.5)", "rgba(241, 245, 249, 0.5)"],
            },
          },
        },
        legend: {
          data: [currentUser.username, compareUserData.username],
          bottom: 0,
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: topicProficiencyChartData[currentUser.username],
                name: currentUser.username,
                symbol: "circle",
                symbolSize: 8,
                areaStyle: {
                  color: "rgba(59, 130, 246, 0.3)",
                },
                lineStyle: {
                  width: 3,
                  color: "rgba(59, 130, 246, 0.8)",
                },
                itemStyle: {
                  color: "#3b82f6",
                },
              },
              {
                value: topicProficiencyChartData[compareUserData.username],
                name: compareUserData.username,
                symbol: "circle",
                symbolSize: 8,
                areaStyle: {
                  color: "rgba(245, 158, 11, 0.3)",
                },
                lineStyle: {
                  width: 3,
                  color: "rgba(245, 158, 11, 0.8)",
                },
                itemStyle: {
                  color: "#f59e0b",
                },
              },
            ],
          },
        ],
      };

      myChart.setOption(option);

      // Resize chart on window resize
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
        myChart.dispose();
      };
    }
  }, [topicProficiencyChartData]);

  // Initialize difficulty distribution comparison chart
  useEffect(() => {
    if (!compareWith) return;

    const chartDom = document.getElementById("difficulty-comparison-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const difficultyRanges = [
        "800-1000",
        "1000-1200",
        "1200-1400",
        "1400-1600",
        "1600-1800",
        "1800-2000",
        "2000+",
      ];

      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: [currentUser.username, compareUserData.username],
          bottom: 0,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: difficultyRanges,
          axisLabel: {
            color: "#6b7280",
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#6b7280",
          },
        },
        series: [
          {
            name: currentUser.username,
            type: "bar",
            data: difficultyChartData[currentUser.username],
            itemStyle: {
              color: "#3b82f6",
            },
          },
          {
            name: compareUserData.username,
            type: "bar",
            data: difficultyChartData[compareUserData.username],
            itemStyle: {
              color: "#f59e0b",
            },
          },
        ],
      };

      myChart.setOption(option);

      // Resize chart on window resize
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
        myChart.dispose();
      };
    }
  }, [difficultyChartData]);

  // Handle user selection
  const handleCompareUser = async () => {
    try {
      const comparisonResponse = await fetch(
        `/api/comparison?userHandle=${selectedUser}&compareToUserHandle=${compareWith}`
      );

      const comparisonData = await comparisonResponse.json();
      setCurrentUser(comparisonData.userInfo);
      setCompareUserData(comparisonData.compareToUserInfo);
      setRatingChartData(comparisonData.ratingChartData);
      setTopicProficiencyChartData(
        comparisonData.topicProficiencyChartData.normalizedProficiency
      );
      setDifficultyChartData(comparisonData.difficultyChartData);
      setContestPerformanceComparison(
        comparisonData.contestPerformanceComparison
      );
      setTags(comparisonData.topicProficiencyChartData.humanizedTags);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  // Toggle metric selection
  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare your performance with other competitive programmers
          </p>
        </div>

        {/* User Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-around items-end  md:flex-row md:space-x-4 ">
            <div className="flex-1 mb-4 md:mb-0">
              <label
                htmlFor="compare-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Username
              </label>
              <div className="relative">
                <input
                  id="compare-search"
                  type="text"
                  placeholder="Enter your username"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
              </div>
            </div>
            <div className="flex-1 mb-4 md:mb-0">
              <label
                htmlFor="compare-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Compare with
              </label>
              <div className="relative">
                <input
                  id="compare-search"
                  type="text"
                  placeholder="Enter username to compare"
                  value={compareWith}
                  onChange={(e) => setCompareWith(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleCompareUser()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer"
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Compare
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        {compareWith && (
          <>
            {/* Comparison Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">
                  Show metrics:
                </span>
                <button
                  onClick={() => toggleMetric("rating")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                    selectedMetrics.includes("rating")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-chart-line mr-1"></i>
                  Rating
                </button>
                <button
                  onClick={() => toggleMetric("problems")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                    selectedMetrics.includes("problems")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-check-circle mr-1"></i>
                  Problems
                </button>
                <button
                  onClick={() => toggleMetric("contests")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                    selectedMetrics.includes("contests")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-trophy mr-1"></i>
                  Contests
                </button>
                <button
                  onClick={() => toggleMetric("topics")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                    selectedMetrics.includes("topics")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-tags mr-1"></i>
                  Topics
                </button>
              </div>
            </div>

            {/* User Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current User Profile */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className="w-16 h-16 rounded-full border-2 border-white"
                    />
                    <div className="ml-4 text-white">
                      <h2 className="text-xl font-bold">
                        {currentUser.username}
                      </h2>
                      <div className="flex items-center mt-1">
                        <i className="fas fa-globe-americas mr-1.5 text-xs"></i>
                        <span className="text-sm">{currentUser.country}</span>
                        <span className="mx-2">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-800 text-white">
                          {currentUser.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Current Rating
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentUser.rating}
                      </p>
                      <p className="text-xs text-gray-500">
                        Max: {currentUser.maxRating}
                      </p>
                    </div>
                    {/* <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Problems Solved
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentUser.problemsSolved}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Contests
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentUser.contestsParticipated}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Avg. Rating Change
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        +{currentUser.averageRatingChange}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Compare User Profile */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-amber-500 px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={compareUserData.avatar}
                      alt={compareUserData.username}
                      className="w-16 h-16 rounded-full border-2 border-white"
                    />
                    <div className="ml-4 text-white">
                      <h2 className="text-xl font-bold">
                        {compareUserData.username}
                      </h2>
                      <div className="flex items-center mt-1">
                        <i className="fas fa-globe-americas mr-1.5 text-xs"></i>
                        <span className="text-sm">
                          {compareUserData.country}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-700 text-white">
                          {compareUserData.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Current Rating
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {compareUserData.rating}
                      </p>
                      <p className="text-xs text-gray-500">
                        Max: {compareUserData.maxRating}
                      </p>
                    </div>
                    {/* <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Problems Solved
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {compareUserData.problemsSolved}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Contests
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {compareUserData.contestsParticipated}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">
                        Avg. Rating Change
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        +{compareUserData.averageRatingChange}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Charts */}
            {selectedMetrics.includes("rating") && (
              <div>
                <div className="bg-white rounded-lg shadow-sm mb-8">
                  <div className="flex justify-between items-center p-2 border-b border-gray-200">
                    <div className="p-6 border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">
                        Rating Comparison
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Rating trends over time
                      </p>
                    </div>
                    <div className="flex space-x-2 p-6 mb-4 md:mb-0">
                      <button
                        onClick={() => setTimeRange("1month")}
                        className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                          timeRange === "1month"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        1M
                      </button>
                      <button
                        onClick={() => setTimeRange("3months")}
                        className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                          timeRange === "3months"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        3M
                      </button>
                      <button
                        onClick={() => setTimeRange("6months")}
                        className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                          timeRange === "6months"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        6M
                      </button>
                      <button
                        onClick={() => setTimeRange("all")}
                        className={`px-3 py-1 text-xs font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                          timeRange === "all"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        1Y
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-80" id="rating-comparison-chart"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Problem Solving Comparison */}
            {selectedMetrics.includes("problems") && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Problem Solving Comparison
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Distribution of solved problems by difficulty
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80" id="difficulty-comparison-chart"></div>
                </div>
              </div>
            )}

            {/* Topic Proficiency Comparison */}
            {selectedMetrics.includes("topics") && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Topic Proficiency Comparison
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Strengths and weaknesses by topic
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80" id="topic-comparison-chart"></div>
                </div>
              </div>
            )}

            {/* Contest Performance Comparison */}
            {selectedMetrics.includes("contests") && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Contest Performance Comparison
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Recent contest results for both users
                  </p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Contest
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {currentUser.username}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {compareUserData.username}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contestPerformanceComparison.map((contest, index) => (
                          <ContestStrip key={index} contestData={contest} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                      View more contests
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {/* <div className="flex justify-end space-x-4 mb-8">
              <button className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 !rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-user-plus mr-2"></i>
                Add to comparison
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm font-medium rounded-md !rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-save mr-2"></i>
                Save comparison
              </button>
            </div> */}
          </>
        )}

        {/* Empty State */}
        {!compareWith && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-blue-100 mb-6">
              <i className="fas fa-chart-bar text-blue-600 text-4xl"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Start a comparison
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Search for a user or select from your friends or suggested rivals
              to compare your competitive programming performance.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Comparison;
