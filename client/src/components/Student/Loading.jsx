// src/pages/Student/Loading.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { setPoll } from "../../store/pollSlice";
import { useDispatch } from "react-redux";
import Chatbot from "../Chatbot";

const Loading = () => {
  const studentName = useSelector((state) => state.student.name);
  const currentPoll = useSelector((state) => state.poll.currentPoll);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!studentName) {
      navigate("/student");
    }
  }, [studentName, navigate]);

  useEffect(() => {
    // Ask server for current poll if any
    socket.emit("getCurrentPoll");

    socket.on("pollStarted", (pollData) => {
      dispatch(setPoll(pollData));
      navigate("/student/question");
    });

    return () => {
      socket.off("pollStarted");
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    if (currentPoll?.question) {
      navigate("/student/question");
    }
  }, [currentPoll, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold mb-3">
          Hi <span className="text-purple-600 animate-pulse">{studentName || "Student"}</span> 👋
        </h1>
        <p className="text-gray-600 text-sm">
          Please wait while your teacher prepares the poll questions. You’ll be redirected automatically once the session starts.
        </p>
      </div>
      <div className="fixed bottom-5 right-5">
       <Chatbot />
      </div>

    </div>

    
  );
};

export default Loading;
