import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Chatbot from "../Chatbot";
import { addMessage, removeParticipant, setParticipants } from "../../store/chatSlice";
import {
  setPoll,
  endPoll,
  resetPoll,
  updateResults,
} from "../../store/pollSlice";

import { socket } from "../../socket";

const TeacherLivePoll = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("live"); 
  const [error, setError] = useState(""); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const poll = useSelector((state) => state.poll.currentPoll);
  const results = useSelector((state) => state.poll.results);
  const status = useSelector((state) => state.poll.status);
  const messages = useSelector((state) => state.chat.messages);
  const participants = useSelector((state) => state.chat.participants);
  const totalVotes = results?.reduce((acc, a) => acc + a, 0) || 0;

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    dispatch(addMessage({ sender: "Teacher", text }));
  };

  const handleRemoveParticipant = (name) => {
    dispatch(removeParticipant(name));
  };

  useEffect(() => {
    socket.on("participantsUpdate", (participants) => {
      dispatch(setParticipants(participants));
    });

    return () => {
      socket.off("participantsUpdate");
    };
  }, [dispatch]);
  useEffect(() => {
    socket.on("pollStarted", (pollData) => {
      dispatch(setPoll(pollData));
      setActiveTab("live"); 
    });

    socket.on("pollResults", (results) => {
      dispatch(updateResults(results));
    });

    socket.on("pollEnded", ({ poll: endedPoll, results }) => {
      dispatch(endPoll({ poll: endedPoll, results }));
      setActiveTab("results"); 
    });
    socket.on("errorMessage", (msg) => {
      setError(msg);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setError("");
      }, 4000);
    });

    return () => {
      socket.off("pollStarted");
      socket.off("pollResults");
      socket.off("pollEnded");
      socket.off("errorMessage");
    };
  }, [dispatch]);

  const handleEndPoll = () => {
    if (!poll) return;
    socket.emit("endPoll"); 
    dispatch(endPoll());
    setActiveTab("results");
  };

  const handleResetPoll = () => {
    dispatch(resetPoll());
    setActiveTab("live");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6 pt-20 relative">
      {showPopup && error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      <div className="absolute top-6 right-6 flex gap-3">
        <button
          onClick={() => navigate("/poll-history")}
          className="bg-gradient-to-r from-[#4F0DCE] to-[#7765DA] text-white px-4 py-2 rounded-full shadow-md cursor-pointer hover:opacity-90 transition flex justify-around items-center gap-2"
        >
          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 6.125C9.25 6.125 3.9125 10.0125 1.75 15.5C3.9125 20.9875 9.25 24.875 15.5 24.875C21.7563 24.875 27.0875 20.9875 29.25 15.5C27.0875 10.0125 21.7563 6.125 15.5 6.125ZM15.5 21.75C12.05 21.75 9.25 18.95 9.25 15.5C9.25 12.05 12.05 9.25 15.5 9.25C18.95 9.25 21.75 12.05 21.75 15.5C21.75 18.95 18.95 21.75 15.5 21.75ZM15.5 11.75C13.4312 11.75 11.75 13.4313 11.75 15.5C11.75 17.5688 13.4312 19.25 15.5 19.25C17.5688 19.25 19.25 17.5688 19.25 15.5C19.25 13.4313 17.5688 11.75 15.5 11.75Z"
              fill="white"
            />
          </svg>
          View Poll History
        </button>
      </div>

      <div className="flex justify-center gap-6 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "live"
              ? "bg-[#4F0DCE] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("live")}
        >
          Live Poll
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "results"
              ? "bg-[#4F0DCE] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("results")}
        >
          Results
        </button>
      </div>

      {activeTab === "live" && (
        <div className="max-w-2xl mx-auto border-2 border-[#7765DA] rounded-lg shadow-lg mb-6 p-4 bg-white">
          <div className="bg-gradient-to-r from-[#000000] to-[#6E6E6E] p-4 rounded-lg shadow mb-6">
            <h2 className="text-white text-2xl font-semibold">
              {poll?.question || "No active poll"}
            </h2>
          </div>
          <div className="space-y-4 mb-4">
            {poll?.options?.map((option, idx) => {
              const votes = results[idx] || 0;
              const percentage = totalVotes
                ? ((votes / totalVotes) * 100).toFixed(1)
                : 0;
              return (
                <div
                  key={idx}
                  className="relative w-full h-12 rounded-md border border-gray-300 overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative z-10 flex items-center h-full px-3 text-[#373737] font-medium">
                    {option.text} ({votes} votes, {percentage}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mt-6">
            {status === "active" && (
              <button
                onClick={handleEndPoll}
                className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                End Poll
              </button>
            )}
            {status === "ended" && (
              <button
                onClick={handleResetPoll}
                className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Start New Poll
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "results" && (
        <div className="max-w-2xl mx-auto border-2 border-green-500 rounded-lg shadow-lg mb-6 p-4 bg-white">
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow mb-6">
            <h2 className="text-white text-2xl font-semibold">
              Results for: {poll?.question || "No poll"}
            </h2>
          </div>

          <ul className="space-y-3">
            {poll?.options?.map((option, idx) => {
              const votes = results[idx] || 0;
              const percentage = totalVotes
                ? ((votes / totalVotes) * 100).toFixed(1)
                : 0;
              return (
                <li
                  key={idx}
                  className={`flex justify-between items-center p-3 rounded-md ${
                    option.isCorrect ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{option.text}</span>
                  <span className="font-semibold text-gray-700">
                    {votes} votes ({percentage}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="max-w-2xl mx-auto flex justify-center mb-6">
        <button
          onClick={() => navigate("/teacher")}
          className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          + Create New Question
        </button>
      </div>
      <div className="fixed bottom-5 right-5">
        <Chatbot isTeacher={true} />
      </div>
    </div>
  );
};

export default TeacherLivePoll;
