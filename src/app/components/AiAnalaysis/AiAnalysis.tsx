import React from "react";
import { AiAnalysisResponse } from "@/app/types/ai-analysis";

const AiAnalysis = ({ analysis }: { analysis: AiAnalysisResponse }) => {
  console.log({ analysis });
  return (
    <div className=" mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Strengths and Weaknesses */}
        <div className="space-y-6">
          {/* Strengths Card */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Strengths</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Strong Topics
                </h3>
                <div className="space-y-4">
                  {analysis.strengthAnalysis.strongTopics.map(
                    (topic, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 border border-green-100"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">
                            {topic.topic}
                          </span>
                          <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                            {topic.proficiency}% Proficiency
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {topic.evidence}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Consistent Patterns
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.strengthAnalysis.consistentPatterns.map(
                    (pattern, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-green-100 flex items-start"
                      >
                        <span className="text-green-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm">{pattern}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
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
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 border border-red-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">
                          {topic.topic}
                        </span>
                        <span className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">
                          {topic.proficiency}% Proficiency
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {topic.suggestedApproach}
                      </p>
                      <div className="space-y-3">
                        {topic.recommendedProblems.map((problem, pIndex) => (
                          <a
                            key={pIndex}
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-800">
                                {problem.name}
                              </span>
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  problem.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {problem.conceptsCovered.map(
                                (concept, cIndex) => (
                                  <span
                                    key={cIndex}
                                    className="text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full border border-gray-200"
                                  >
                                    {concept}
                                  </span>
                                )
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Improvement Areas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.weaknessAnalysis.improvementAreas.map(
                    (area, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-red-100 flex items-start"
                      >
                        <span className="text-red-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm">{area}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Practice, Contest, Time Management, and Milestones */}
        <div className="space-y-6">
          {/* Practice Strategy Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Practice Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Daily Routine
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.dailyRoutine.map((step, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-blue-100 flex items-start"
                    >
                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weekly Goals
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.weeklyGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-blue-100 flex items-start"
                    >
                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                      <span className="text-gray-700 text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Topic-wise Plan
                </h3>
                <div className="space-y-3">
                  {analysis.practiceStrategy.topicWisePlan.map(
                    (plan, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-blue-100"
                      >
                        <h4 className="font-medium text-gray-800 mb-1">
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
                              className="block text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Resource {lIndex + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contest Strategy Card */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-xl">🏆</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Contest Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Preparation Tips
                </h3>
                <div className="space-y-3">
                  {analysis.contestStrategy.preparationTips.map(
                    (tip, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-purple-100 flex items-start"
                      >
                        <span className="text-purple-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm">{tip}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  During Contest
                </h3>
                <div className="space-y-3">
                  {analysis.contestStrategy.duringContestAdvice.map(
                    (advice, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-purple-100 flex items-start"
                      >
                        <span className="text-purple-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm">{advice}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Post Contest
                </h3>
                <div className="space-y-3">
                  {analysis.contestStrategy.postContestLearning.map(
                    (learning, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-purple-100 flex items-start"
                      >
                        <span className="text-purple-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm">
                          {learning}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time Management Card */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 text-xl">⏰</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Time Management
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Problem Solving Time
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    analysis.timeManagement.problemSolvingTimeBreakdown
                  ).map(([phase, time]) => (
                    <div
                      key={phase}
                      className="bg-white rounded-lg p-3 border border-amber-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 capitalize">
                          {phase}
                        </span>
                        <span className="text-amber-700 font-medium">
                          {time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Practice Schedule
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Weekday
                    </h4>
                    <div className="space-y-2">
                      {analysis.timeManagement.practiceSchedule.weekday.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-2 border border-amber-100 text-sm text-gray-700"
                          >
                            • {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Weekend
                    </h4>
                    <div className="space-y-2">
                      {analysis.timeManagement.practiceSchedule.weekend.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-2 border border-amber-100 text-sm text-gray-700"
                          >
                            • {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Next Milestones
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Short Term Goals
                </h3>
                <div className="space-y-3">
                  {analysis.nextMilestones.shortTerm.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-indigo-100"
                    >
                      <h4 className="font-medium text-gray-800 mb-1">
                        {goal.goal}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Timeframe: {goal.timeframe}
                      </p>
                      <div className="space-y-1">
                        {goal.actionItems.map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="text-indigo-500 mr-2 mt-0.5">
                              •
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Long Term Goals
                </h3>
                <div className="space-y-3">
                  {analysis.nextMilestones.longTerm.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-indigo-100"
                    >
                      <h4 className="font-medium text-gray-800 mb-1">
                        {goal.goal}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Timeframe: {goal.timeframe}
                      </p>
                      <div className="space-y-1">
                        {goal.prerequisites.map((prereq, pIndex) => (
                          <div
                            key={pIndex}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="text-indigo-500 mr-2 mt-0.5">
                              •
                            </span>
                            <span>{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;
