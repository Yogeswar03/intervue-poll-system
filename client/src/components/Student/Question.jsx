import React, { useState, useEffect } from "react";
import Chatbot from "../Chatbot";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  submitAnswer,
  setPoll,
  updateResults,
  endPoll,
} from "../../store/pollSlice";
import { socket } from "../../socket";

const Question = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const poll = useSelector((state) => state.poll.currentPoll);
  const results = useSelector((state) => state.poll.results);
  const studentName = useSelector((state) => state.student?.name) || "Student";

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poll?.timeLimit || 60);

  // ✅ Ask server for current poll when page loads
  useEffect(() => {
    socket.emit("getCurrentPoll");
  }, []);

  useEffect(() => {
  if (studentName) {
    socket.emit("join", { name: studentName, role: "student" }); // ✅ send object
  }

  return () => {
    socket.emit("leave", { name: studentName, role: "student" }); // ✅ cleanup
  };
}, [studentName]);


  // ✅ Listen for poll events
  useEffect(() => {
    socket.on("pollStarted", (pollData) => {
      dispatch(setPoll(pollData));
      setTimeLeft(pollData.timeLimit || 60);
      setSubmitted(false);
      setSelectedOption(null);
    });

    socket.on("pollResults", (results) => {
      dispatch(updateResults(results));
    });

    socket.on("pollEnded", (data) => {
      dispatch(endPoll(data));
      navigate("/student/waiting"); // you can change this route
    });

    return () => {
      socket.off("pollStarted");
      socket.off("pollResults");
      socket.off("pollEnded");
    };
  }, [dispatch, navigate]);

  // ✅ Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    dispatch(
      submitAnswer({
        clientId: studentName,
        optionIndex: selectedOption,
      })
    );

    socket.emit("submitAnswer", {
      studentName,
      optionIndex: selectedOption,
    });

    setSubmitted(true);
  };

  // ✅ No active poll → show waiting screen
  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl text-gray-600">
          No active poll yet. Please wait…
        </h2>
      </div>
    );
  }

  const totalVotes = results.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 relative">
      <div className="w-full max-w-lg space-y-6">
        {/* ✅ Question Header with Timer */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">
            {poll?.question || "Waiting for question..."}
          </h2>

          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="red"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={
                  (timeLeft / (poll?.timeLimit || 60)) * 2 * Math.PI * 22
                }
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-bold text-red-600">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* ✅ Question Box */}
        <div className="rounded-lg shadow-md border overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 font-medium">
            {poll?.question}
          </div>

          {!submitted ? (
            <div className="space-y-3 p-4">
              {poll?.options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`cursor-pointer border rounded-md px-4 py-3 flex items-center justify-between transition relative
                    ${
                      selectedOption === index
                        ? "border-2 border-yellow-400 bg-yellow-50"
                        : "border-gray-300 bg-gray-100 hover:border-purple-500"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full border text-sm font-semibold">
                      {index + 1}
                    </span>
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {poll?.options?.map((option, index) => {
                const votes = results[index] || 0;
                const percentage = totalVotes
                  ? ((votes / totalVotes) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                    key={index}
                    className={`border rounded-md px-4 py-3 flex items-center justify-between bg-gray-100 relative overflow-hidden ${
                      selectedOption === index ? "ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-purple-500"
                      style={{ width: `${percentage}%`, opacity: 0.8 }}
                    ></div>

                    <div className="flex items-center gap-2 relative z-10 text-white font-medium">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border bg-white text-gray-800 text-sm font-semibold">
                        {index + 1}
                      </span>
                      {option.text}
                    </div>

                    <span className="relative z-10 font-semibold text-white">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-lg font-medium transition ${
              selectedOption === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
            }`}
          >
            Submit
          </button>
        )}
      </div>

      {submitted && (
        <div className="text-center mt-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Wait for the teacher to ask a new question..
          </h2>
        </div>
      )}

      <div className="fixed bottom-5 right-5">
        <Chatbot />
      </div>
    </div>
  );
};

export default Question;
