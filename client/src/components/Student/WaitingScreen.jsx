
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {socket} from "../../socket";
import Chatbot from "../Chatbot";

const WaitingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    
    socket.on("pollStarted", (pollData) => {
      dispatch({ type: "poll/setPoll", payload: pollData });
      navigate("/student/question");
    });

   
    socket.on("pollEnded", () => {
      navigate("/student/waiting");
    });

    return () => {
      socket.off("pollStarted");
      socket.off("pollEnded");
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {/* Loader spinner */}
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">
          Wait for the teacher to ask a new question..
        </h1>
      </div>
      <div className="fixed bottom-5 right-5">
       <Chatbot collapsed={true} />
      </div>

    </div>
  );
};

export default WaitingScreen;
