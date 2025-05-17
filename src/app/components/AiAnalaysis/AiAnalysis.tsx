import React from "react";
import {
  AiAnalysisResponse,
  ShortTermGoal,
  LongTermGoal,
} from "@/app/types/ai-analysis";
import { motion } from "framer-motion";

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
                            {topic.topic}
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
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800 text-base">
                          {topic.topic}
                        </span>
                        <span className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                          {topic.proficiency}% Proficiency
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {topic.suggestedApproach}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topic.recommendedProblems.map((problem, pIndex) => (
                          <motion.a
                            key={pIndex}
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            className="block bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-800 text-sm">
                                {problem.name}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  problem.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.conceptsCovered.map(
                                (concept, cIndex) => (
                                  <span
                                    key={cIndex}
                                    className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                                  >
                                    {concept}
                                  </span>
                                )
                              )}
                            </div>
                          </motion.a>
                        ))}
                      </div>
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
