import React, { useState, useRef, useCallback } from "react";
import {
  AiAnalysisResponse,
  ShortTermGoal,
  LongTermGoal,
} from "@/app/types/ai-analysis";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { FiPlus } from "react-icons/fi";

interface PracticeProblem {
  name: string;
  difficulty: number;
  link: string;
  conceptsCovered: string[];
}

interface TopicPagination {
  page: number;
  hasMore: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const AiAnalysis = ({ analysis }: { analysis: AiAnalysisResponse }) => {
  const { user } = useAuth();
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [practiceProblems, setPracticeProblems] = useState<
    Record<string, PracticeProblem[]>
  >({});
  const [loadingProblems, setLoadingProblems] = useState<
    Record<string, boolean>
  >({});
  const [pagination, setPagination] = useState<Record<string, TopicPagination>>(
    {}
  );
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});
  const observerRefs = useRef<Record<string, IntersectionObserver>>({});

  const toggleTopic = async (topic: string) => {
    setExpandedTopics((prev) => {
      const newState = { ...prev, [topic]: !prev[topic] };

      // If topic is being expanded and we don't have problems loaded yet
      if (newState[topic] && !practiceProblems[topic]) {
        fetchPracticeProblems(topic, 1);
      }

      return newState;
    });
  };

  const toggleTags = (problemId: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const fetchPracticeProblems = async (topic: string, page: number) => {
    if (!user?.userHandle) return;

    setLoadingProblems((prev) => ({ ...prev, [topic]: true }));
    try {
      const response = await fetch(
        `/api/ai-analysis/practice-problems?topicName=${encodeURIComponent(
          topic
        )}&userHandle=${user.userHandle}&page=${page}&limit=10`
      );
      if (!response.ok) throw new Error("Failed to fetch practice problems");
      const { data } = await response.json();

      setPracticeProblems((prev) => ({
        ...prev,
        [topic]: page === 1 ? data : [...(prev[topic] || []), ...data],
      }));

      setPagination((prev) => ({
        ...prev,
        [topic]: {
          page,
          hasMore: data.length === 10,
        },
      }));
    } catch (error) {
      console.error("Error fetching practice problems:", error);
    } finally {
      setLoadingProblems((prev) => ({ ...prev, [topic]: false }));
    }
  };

  const lastProblemRef = useCallback(
    (node: HTMLTableRowElement | null, topic: string) => {
      if (loadingProblems[topic]) return;

      if (observerRefs.current[topic]) {
        observerRefs.current[topic].disconnect();
      }

      observerRefs.current[topic] = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination[topic]?.hasMore) {
          fetchPracticeProblems(topic, pagination[topic].page + 1);
        }
      });

      if (node) {
        observerRefs.current[topic].observe(node);
      }
    },
    [loadingProblems, pagination]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-3 py-8"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Strengths Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform rotate-3">
                <span className="text-gray-600 text-xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Strengths
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Strong Topics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.strengthAnalysis.strongTopics.map(
                    (topic, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-800 text-base">
                            {topic.topic.toLocaleUpperCase()}
                          </span>
                          <span className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                            {topic.proficiency}% Proficiency
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {topic.evidence}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Consistent Patterns
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysis.strengthAnalysis.consistentPatterns.map(
                    (pattern, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-lg mt-0.5">
                            •
                          </span>
                          <span className="text-sm text-gray-700">
                            {pattern}
                          </span>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weaknesses Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform -rotate-3">
                <span className="text-gray-600 text-xl">!</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Areas for Improvement
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weak Topics
                </h3>
                <div className="space-y-4">
                  {analysis.weaknessAnalysis.weakTopics.map((topic, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <div
                        className="flex justify-between items-center mb-3 cursor-pointer"
                        onClick={() => toggleTopic(topic.topic)}
                      >
                        <span className="font-semibold text-gray-800 text-base">
                          {topic.topic.toLocaleUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                            {topic.proficiency}% Proficiency
                          </span>
                          <span className="text-gray-500">
                            {expandedTopics[topic.topic] ? "▼" : "▶"}
                          </span>
                        </div>
                      </div>

                      {expandedTopics[topic.topic] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {topic.suggestedApproach}
                          </p>

                          <div className="relative">
                            <div className="overflow-x-auto">
                              <div className="h-[400px] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                      >
                                        Problem Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                      >
                                        Rating
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                      >
                                        Tags
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {practiceProblems[topic.topic]?.map(
                                      (problem, pIndex) => (
                                        <tr
                                          key={pIndex}
                                          ref={
                                            pIndex ===
                                            practiceProblems[topic.topic]
                                              .length -
                                              1
                                              ? (node) =>
                                                  lastProblemRef(
                                                    node,
                                                    topic.topic
                                                  )
                                              : null
                                          }
                                          className="hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <a
                                              href={problem.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                              {problem.name}
                                            </a>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                problem.difficulty <= 1200
                                                  ? "bg-green-100 text-green-800"
                                                  : problem.difficulty <= 1600
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}
                                            >
                                              {problem.difficulty}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                              {problem.conceptsCovered
                                                .slice(
                                                  0,
                                                  expandedTags[
                                                    `${topic.topic}-${pIndex}`
                                                  ]
                                                    ? undefined
                                                    : 3
                                                )
                                                .map((concept, cIndex) => (
                                                  <span
                                                    key={cIndex}
                                                    className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                                                  >
                                                    {concept}
                                                  </span>
                                                ))}
                                              {problem.conceptsCovered.length >
                                                3 && (
                                                <button
                                                  onClick={() =>
                                                    toggleTags(
                                                      `${topic.topic}-${pIndex}`
                                                    )
                                                  }
                                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                  <FiPlus className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                                {loadingProblems[topic.topic] && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 flex justify-center items-center border-t border-gray-200">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                    <span className="ml-2 text-sm text-gray-600">
                                      Loading more problems...
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Improvement Areas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysis.weaknessAnalysis.improvementAreas.map(
                    (area, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-lg mt-0.5">
                            •
                          </span>
                          <span className="text-sm text-gray-700">{area}</span>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Practice Strategy Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform rotate-3">
                <span className="text-gray-600 text-xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Practice Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Daily Routine
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.dailyRoutine.map((step, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-lg mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weekly Goals
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.weeklyGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-lg mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Topic-wise Plan
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.topicWisePlan.map(
                    (plan, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-gray-100"
                      >
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {plan.topic}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {plan.timeAllocation}
                        </p>
                        <div className="space-y-1">
                          {plan.resourceLinks.map((link, lIndex) => (
                            <a
                              key={lIndex}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Resource {lIndex + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Contest Strategy Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform -rotate-3">
                <span className="text-gray-600 text-xl">🏆</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Contest Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Preparation Tips",
                  items: analysis.contestStrategy.preparationTips,
                  color: "gray",
                },
                {
                  title: "During Contest",
                  items: analysis.contestStrategy.duringContestAdvice,
                  color: "gray",
                },
                {
                  title: "Post Contest",
                  items: analysis.contestStrategy.postContestLearning,
                  color: "gray",
                },
              ].map((section, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, iIndex) => (
                      <div
                        key={iIndex}
                        className="bg-white rounded-lg p-3 border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-lg mt-0.5">
                            •
                          </span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Time Management Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform rotate-3">
                <span className="text-gray-600 text-xl">⏰</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Time Management
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Problem Solving Time
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    analysis.timeManagement.problemSolvingTimeBreakdown
                  ).map(([phase, time]) => (
                    <div
                      key={phase}
                      className="bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 capitalize font-medium text-sm">
                          {phase}
                        </span>
                        <span className="text-gray-700 font-semibold text-sm">
                          {time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Practice Schedule
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Weekday",
                      items: analysis.timeManagement.practiceSchedule.weekday,
                    },
                    {
                      title: "Weekend",
                      items: analysis.timeManagement.practiceSchedule.weekend,
                    },
                  ].map((schedule, index) => (
                    <div key={index}>
                      <h4 className="text-base font-medium text-gray-700 mb-3">
                        {schedule.title}
                      </h4>
                      <div className="space-y-2">
                        {schedule.items.map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="bg-white rounded-lg p-3 border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-lg mt-0.5">
                                •
                              </span>
                              <span className="text-sm text-gray-700">
                                {item}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Milestones Section */}
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center transform -rotate-3">
                <span className="text-gray-600 text-xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Next Milestones
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Short Term Goals",
                  goals: analysis.nextMilestones.shortTerm,
                  color: "gray",
                },
                {
                  title: "Long Term Goals",
                  goals: analysis.nextMilestones.longTerm,
                  color: "gray",
                },
              ].map((section, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.goals.map((goal, gIndex) => (
                      <div
                        key={gIndex}
                        className="bg-white rounded-lg p-4 border border-gray-100"
                      >
                        <h4 className="font-semibold text-gray-800 text-base mb-1">
                          {goal.goal}
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          Timeframe: {goal.timeframe}
                        </p>
                        <div className="space-y-1.5">
                          {("actionItems" in goal
                            ? (goal as ShortTermGoal).actionItems
                            : (goal as LongTermGoal).prerequisites
                          ).map((item: string, iIndex: number) => (
                            <div
                              key={iIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="text-gray-500 text-lg mt-0.5">
                                •
                              </span>
                              <span className="text-sm text-gray-700">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AiAnalysis;
