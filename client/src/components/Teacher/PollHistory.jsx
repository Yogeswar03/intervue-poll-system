// src/pages/Teacher/PollHistory.jsx
import React from "react";
import Chatbot from "../Chatbot";
import { useSelector } from "react-redux";

const PollHistory = () => {
  // ✅ Always fall back to an empty array
  const pollHistoryData = useSelector((state) => state.poll.history) || [];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        View <span className="text-[#4F0DCE]">Poll History</span>
      </h1>

      {pollHistoryData.length === 0 ? (
        <p className="text-gray-500">No polls have been conducted yet.</p>
      ) : (
        pollHistoryData.map((poll, idx) => {
          return (
            <div key={idx} className="mb-10">
              <h2 className="text-xl font-semibold mb-3">
                Question {idx + 1}
              </h2>
              <div className="border rounded-lg overflow-hidden shadow">
                {/* Question */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-500 text-white px-4 py-2 font-semibold">
                  {poll.question}
                </div>

                {/* Options */}
                <div className="p-4 space-y-3">
                  {poll.options?.map((opt, i) => (
                    <div
                      key={i}
                      className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center"
                    >
                      {/* Filled percentage bar */}
                      <div
                        className="absolute left-0 top-0 h-full bg-[#7765DA] transition-all duration-500"
                        style={{ width: `${opt.percentage}%` }}
                      ></div>

                      {/* Text */}
                      <div className="relative flex justify-between w-full px-4 py-2 font-medium">
                        <span>
                          {i + 1}. {opt.option}
                        </span>
                        <span>
                          {opt.percentage}% ({opt.votes} votes)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* ✅ Chatbot floating button (collapsed by default) */}
      <div className="fixed bottom-5 right-5">
        <Chatbot isTeacher={true} />
      </div>
    </div>
  );
};

export default PollHistory;
