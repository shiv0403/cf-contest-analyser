"use client";
import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { darkenHexColor, getRatingColors } from "@/lib/helpers/contestHelpers";
import ContestStrip from "../components/Comparison/ContestStrip";
import Image from "next/image";
import ComparisonSkeleton from "../components/Comparison/ComparisonSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/ToastContext";

type UserData = {
  id: number;
  username: string;
  avatar: string;
  country: string;
  rank: string;
  rating: number;
  maxRating: number;
  problemsSolved: number;
  contestsParticipated: number;
};

type ContestPerformance = {
  contestName: string;
  contestDate: string;
  userRatingChanges: string;
  compareToUserRatingChanges: string;
};

const Comparison = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [compareWith, setCompareWith] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState<UserData>();
  const [compareUserData, setCompareUserData] = useState<UserData>();
  const [ratingChartData, setRatingChartData] = useState<
    Record<string, Record<string, Array<number>>>
  >({});
  const [contestPerformanceComparison, setContestPerformanceComparison] =
    useState<Array<ContestPerformance>>([]);
  const [visibleContestsCount, setVisibleContestsCount] = useState(5);
  const [difficultyChartData, setDifficultyChartData] = useState<
    Record<string, number[]>
  >({});
  const [topicProficiencyChartData, setTopicProficiencyChartData] = useState<
    Record<string, Record<string, number>>
  >({});
  const [tags, setTags] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "rating",
    "problems",
    "contests",
    "topics",
  ]);

  const session = true; // TODO: Replace with actual session check when implelent auth
  const router = useRouter();

  // Set the selected user to the logged-in user's handle when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userHandle) {
      setSelectedUser(user.userHandle);
    }
  }, [isAuthenticated, user]);

  const handleLoadMoreContests = () => {
    setVisibleContestsCount((prevCount) => prevCount + 5);
  };

  // Initialize rating comparison chart
  useEffect(() => {
    if (!currentUser || !compareUserData) return;

    const chartDom = document.getElementById("rating-comparison-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const selectedData =
        ratingChartData[timeRange as keyof typeof ratingChartData] ||
        ratingChartData["6months"];

      const option = {
        animation: true,
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
  }, [timeRange, ratingChartData, selectedMetrics]);

  // Initialize topic proficiency comparison chart
  useEffect(() => {
    if (!currentUser || !compareUserData) return;

    const chartDom = document.getElementById("topic-comparison-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        animation: true,
        radar: {
          indicator: tags.map((tag) => ({
            name: tag,
            max: 100,
          })),
          radius: "80%",
          center: ["50%", "50%"],
          splitNumber: 8,
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
          right: 0,
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
                  color: getRatingColors(currentUser.rating),
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
                  color: getRatingColors(compareUserData.rating),
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
  }, [topicProficiencyChartData, selectedMetrics]);

  // Initialize difficulty distribution comparison chart
  useEffect(() => {
    if (!currentUser || !compareUserData) return;

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
        animation: true,
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
              color: getRatingColors(currentUser.rating),
            },
          },
          {
            name: compareUserData.username,
            type: "bar",
            data: difficultyChartData[compareUserData.username],
            itemStyle: {
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
  }, [difficultyChartData, selectedMetrics]);

  // Handle user selection
  const handleCompareUser = async () => {
    if (!selectedUser.trim() || !compareWith.trim()) return;

    setIsComparing(true);
    try {
      const comparisonResponse = await fetch(
        `/api/comparison?userHandle=${selectedUser}&compareToUserHandle=${compareWith}`
      );

      if (!comparisonResponse.ok) {
        const errorData = await comparisonResponse.json();
        throw new Error(
          errorData.error?.message || "Failed to fetch comparison data"
        );
      }

      const { data: comparisonData } = await comparisonResponse.json();
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
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to fetch comparison data",
        "error"
      );
    } finally {
      setIsComparing(false);
    }
  };

  const handleCreateLockout = async () => {
    if (!currentUser || !compareUserData) {
      return;
    }

    try {
      const response = await fetch(`/api/lockout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostHandle: currentUser.username,
          opponentHandle: compareUserData.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed creating lockout contest"
        );
      }

      // Redirect to the new lockout page
      router.push(`/lockouts`);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed creating lockout contest",
        "error"
      );
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

  if (isAuthLoading) {
    return <ComparisonSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare your performance with other competitive programmers
          </p>
        </div>

        {/* User Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {!isAuthenticated && !isAuthLoading && (
              <div className="flex-1">
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    disabled={isComparing}
                  />
                  <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
                </div>
              </div>
            )}
            <div className="flex-1">
              <label
                htmlFor="compare-with"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Compare with
              </label>
              <div className="relative">
                <input
                  id="compare-with"
                  type="text"
                  placeholder="Enter username to compare"
                  value={compareWith}
                  onChange={(e) => setCompareWith(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  disabled={isComparing}
                />
                <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCompareUser}
                disabled={
                  !selectedUser.trim() || !compareWith.trim() || isComparing
                }
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium relative overflow-hidden ${
                  isComparing ? "animate-pulse" : ""
                }`}
              >
                {isComparing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Comparing...
                  </span>
                ) : (
                  "Compare"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        {isComparing ? (
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="space-y-4">
              {/* User Profile Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-48"></div>
                ))}
              </div>

              {/* Charts Skeleton */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        ) : currentUser && compareUserData ? (
          <>
            {/* Comparison Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">
                  Show metrics:
                </span>
                <button
                  onClick={() => toggleMetric("rating")}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedMetrics.includes("rating")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-chart-line mr-1"></i>
                  Rating
                </button>
                <button
                  onClick={() => toggleMetric("problems")}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedMetrics.includes("problems")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-check-circle mr-1"></i>
                  Problems
                </button>
                <button
                  onClick={() => toggleMetric("contests")}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedMetrics.includes("contests")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-trophy mr-1"></i>
                  Contests
                </button>
                <button
                  onClick={() => toggleMetric("topics")}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedMetrics.includes("topics")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-tags mr-1"></i>
                  Topics
                </button>
              </div>
              {session && (
                <div>
                  <button
                    onClick={handleCreateLockout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Create Lockout
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current User Profile */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="px-6 py-4"
                  style={{
                    backgroundColor: getRatingColors(currentUser.rating),
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      width={56}
                      height={56}
                      src={currentUser.avatar || "/default-cf-img.svg"}
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
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{
                            backgroundColor: darkenHexColor(
                              getRatingColors(currentUser.rating) || "#000000"
                            ),
                          }}
                        >
                          {currentUser.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-row gap-4 justify-around">
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
                    <div className="text-center">
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
                  </div>
                </div>
              </div>

              {/* Compare User Profile */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="px-6 py-4"
                  style={{
                    backgroundColor: getRatingColors(compareUserData.rating),
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      src={compareUserData.avatar || "/default-cf-img.svg"}
                      alt={compareUserData.username}
                      width={56}
                      height={56}
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
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{
                            backgroundColor: darkenHexColor(
                              getRatingColors(compareUserData.rating) ||
                                "#000000"
                            ),
                          }}
                        >
                          {compareUserData.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-row gap-4 justify-around">
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
                    <div className="text-center">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Charts */}
            {selectedMetrics.includes("rating") && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Rating Comparison
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Rating trends over time
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setTimeRange("1month")}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        timeRange === "1month"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => setTimeRange("3months")}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        timeRange === "3months"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      3M
                    </button>
                    <button
                      onClick={() => setTimeRange("6months")}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        timeRange === "6months"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      6M
                    </button>
                    <button
                      onClick={() => setTimeRange("all")}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        timeRange === "all"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                  </div>
                  <div className="h-80" id="rating-comparison-chart"></div>
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
                  <div className="h-100" id="topic-comparison-chart"></div>
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
                        {contestPerformanceComparison
                          .slice(0, visibleContestsCount)
                          .map((contest, index) => (
                            <ContestStrip key={index} contestData={contest} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleLoadMoreContests}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View more contests
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* Empty State */}
        {!currentUser && !compareUserData && !isComparing && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <i className="fas fa-chart-bar text-red-600 text-4xl"></i>
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
