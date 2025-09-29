import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerStudent } from "../../store/studentSlice";
import { socket } from "../../socket";

const GetStarted = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = () => {
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      dispatch(registerStudent({ name: trimmed }));
       socket.emit("join", { name: name.trim(), role: "student" }); 
      navigate("/student/question");
    }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <div className="text-center max-w-md">
      
        <div className="mb-6">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            ✦ Intervue Poll
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-3">
          Let’s <span className="text-purple-600">Get Started</span>
        </h1>

        <p className="text-gray-600 text-sm mb-8">
          If you’re a student, you’ll be able to <b>submit your answers</b>,
          participate in live polls, and see how your responses compare with
          your classmates.
        </p>

        <div className="flex flex-col gap-3">
          <label className="text-gray-700 text-sm text-left">
            Enter your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={name.trim().length < 2}
          className={`mt-6 w-full py-3 rounded-md text-white font-medium transition 
            ${
              name.trim().length >= 2
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
