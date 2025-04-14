import React from "react";

type WeakTopic = {
  name: string;
  proficiency: number;
  effort: string;
  problems: Array<string>;
};

const AiAnalysis = ({ weakTopics }: { weakTopics: Array<WeakTopic> }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weak Topics
          </h3>
          {weakTopics.map((topic, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {topic.name}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {topic.proficiency}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    topic.proficiency < 30
                      ? "bg-red-500"
                      : topic.proficiency < 50
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${topic.proficiency}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Effort needed: {topic.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recommended Problems
          </h3>
          <div className="space-y-6">
            {weakTopics.map((topic, index) => (
              <div key={index}>
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  {topic.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {topic.problems.map((problem, pIndex) => (
                    <div
                      key={pIndex}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-800 mb-2">
                        {problem}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            pIndex === 0
                              ? "bg-green-100 text-green-800"
                              : pIndex === 1
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {pIndex === 0
                            ? "Easy"
                            : pIndex === 1
                            ? "Medium"
                            : "Hard"}
                        </span>
                        <button className="text-blue-500 hover:text-blue-700 text-sm !rounded-button whitespace-nowrap cursor-pointer">
                          <i className="fas fa-external-link-alt"></i> Solve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiAnalysis;
