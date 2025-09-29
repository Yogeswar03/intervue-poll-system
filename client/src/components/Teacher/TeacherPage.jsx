// src/pages/teacher/Teacher_page.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPollData } from "../../store/teacherSlice";
import { setPoll } from "../../store/pollSlice";
import { socket } from "../../socket"; // ✅ import socket
import Chatbot from "../Chatbot";

const Teacher_page = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState("60");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle option text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

   useEffect(() => {
    socket.connect(); // ensure connection
    socket.emit("join", { name: "Teacher", role: "teacher" });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle correct answer change (only one correct at a time)
  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index, // only one correct
    }));
    setOptions(newOptions);
  };

  // Add new option
  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  // Validation & Submit handler
  const handleSubmit = () => {
    setError("");

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    if (options.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }
    if (options.some((opt) => !opt.text.trim())) {
      setError("Please fill out all option fields.");
      return;
    }
    if (!options.some((opt) => opt.isCorrect === true)) {
      setError("Please select the correct option.");
      return;
    }

    // ✅ Ensure options are normalized before saving
    const cleanedOptions = options.map((opt) => ({
      text: opt.text.trim(),
      isCorrect: !!opt.isCorrect,
    }));

    // Create poll object
    const pollData = {
      id: Date.now().toString(36),
      question: question.trim(),
      options: cleanedOptions,
      timeLimit: parseInt(timeLimit, 10),
      startedAt: Date.now(),
    };

    // ✅ Save in Redux
    dispatch(setPollData({ question, options: cleanedOptions, timeLimit }));
    dispatch(setPoll(pollData));

    // ✅ Emit to server via socket
    socket.emit("startPoll", pollData);
    socket.emit("pollStarted", pollData);

    // Reset form
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setTimeLimit("60");

    // Go to live teacher page
    navigate("/teacher/live");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-start pl-[123px] pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] ml-4">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.2762 8.76363C12.2775 8.96965 12.2148 9.17098 12.0969 9.33992C11.979 9.50887 11.8116 9.63711 11.6178 9.707L8.35572 10.907L7.15567 14.1671C7.08471 14.3604 6.95614 14.5272 6.78735 14.645C6.61855 14.7628 6.41766 14.826 6.21181 14.826C6.00596 14.826 5.80506 14.7628 5.63627 14.645C5.46747 14.5272 5.33891 14.3604 5.26794 14.1671L4.06537 10.9111L0.804778 9.71104C0.611716 9.63997 0.445097 9.5114 0.327404 9.34266C0.20971 9.17392 0.146606 8.97315 0.146606 8.76742C0.146606 8.56169 0.20971 8.36092 0.327404 8.19218C0.445097 8.02345 0.611716 7.89487 0.804778 7.82381L4.06688 6.62376L5.26693 3.36418C5.33799 3.17112 5.46657 3.0045 5.6353 2.88681C5.80404 2.76911 6.00482 2.70601 6.21054 2.70601C6.41627 2.70601 6.61705 2.76911 6.78578 2.88681C6.95452 3.0045 7.08309 3.17112 7.15416 3.36418L8.35421 6.62629L11.6138 7.82633C11.8074 7.8952 11.9749 8.02223 12.0935 8.19003C12.2121 8.35782 12.2759 8.55817 12.2762 8.76363Z"
            fill="white"
          />
        </svg>
        <div className="text-white font-medium text-sm sm:text-base">
          Intervue Poll
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl px-4 py-3">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#373737]">
            Let’s <span className="text-[#4F0DCE]">Get Started</span>
          </h1>
          <p className="text-[#6E6E6E] mt-2 text-sm sm:text-base">
            Create and manage polls, ask questions, and monitor responses in
            real-time.
          </p>
        </div>

        {/* Question + Time Select */}
        <div className="mb-8 flex justify-between items-center">
          <label className="block font-semibold mb-2 text-[#373737]">
            Enter your question
          </label>
          <div className="relative inline-block mt-1">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="appearance-none bg-[#F2F2F2] rounded-sm px-4 py-3 shadow-md text-[#373737] focus:outline-none w-40 pr-3"
            >
              <option value="10">10 seconds</option>
              <option value="20">20 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center">
              <svg
                className="w-4 h-4 fill-[#4F0DCE]"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0L5 6L10 0H0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Question Box */}
        <div className="mt-2 relative w-[738px]">
          <textarea
            className="w-full h-[200px] rounded-sm p-3 resize-none bg-[#F2F2F2] shadow-md focus:outline-none text-[#373737]"
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            maxLength={150}
          />
          <p className="absolute bottom-2 right-3 text-sm text-[#6E6E6E]">
            {question.length}/150
          </p>
        </div>

        {/* Options */}
        <div>
          <h3 className="font-semibold mb-4 text-[#373737]">Edit Options</h3>
          {options.map((option, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-3 p-3 rounded-sm"
            >
              <span className="bg-[#7765DA] text-white w-8 h-6 flex items-center justify-center rounded-full text-sm">
                {index + 1}
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow rounded-sm p-2 bg-[#F2F2F2] shadow-md w-full focus:outline-none text-[#373737]"
                placeholder={`Option ${index + 1}`}
              />
              <div className="flex items-center gap-4 ml-0 sm:ml-6">
                <label className="flex items-center gap-1 text-[#373737]">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect === true}
                    onChange={() => handleCorrectChange(index)}
                  />
                  Correct
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addOption}
            className="mt-3 text-[#4F0DCE] border border-[#4F0DCE] rounded-lg px-4 py-2 hover:bg-[#f3f0ff] transition"
          >
            + Add More Option
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 font-medium text-sm">{error}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-l from-[#8F64E1] to-[#1D68BD] text-white px-8 py-3 rounded-full font-medium w-full sm:w-auto shadow-md cursor-pointer transition"
          >
            Ask Question
          </button>
        </div>
      </div>
      <div className="fixed bottom-5 right-5">
       <Chatbot isTeacher={true} />
      </div>

    </div>
  );
};

export default Teacher_page;
