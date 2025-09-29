
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student");
    } else if (selectedRole === "teacher") {
      navigate("/teacher");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F2F2F2] px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD]">
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

      {/* Heading */}
      <h1 className="text-2xl sm:text-[40px] font-medium text-[#373737] text-center mb-2">
        Welcome to the{" "}
        <span className="font-bold text-[#4F0DCE]">Live Polling System</span>
      </h1>
      <p className="text-[#6E6E6E] text-[19px] sm:text-base mt-2 mb-8 text-center max-w-md">
        Please select the role that best describes you to begin using the live
        polling system.
      </p>

      {/* Role Options */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap justify-center">
        {/* Student */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedRole("student")}
          className={`w-[387px] h-[143px] border-2 rounded-md px-6 py-4 cursor-pointer transition 
            ${
              selectedRole === "student"
                ? "border-[#4F0DCE] bg-[#F8F6FF]"
                : "border-[#D9D9D9] hover:border-[#4F0DCE]"
            }`}
        >
          <h3 className="font-semibold text-[#373737] mb-1">I’m a Student</h3>
          <p className="text-[#6E6E6E] text-sm sm:text-base">
            Join polls created by your teacher and submit answers in real time.
          </p>
        </div>

        {/* Teacher */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedRole("teacher")}
          className={`w-[387px] h-[143px] border-2 rounded-md px-6 py-4 cursor-pointer transition 
            ${
              selectedRole === "teacher"
                ? "border-[#4F0DCE] bg-[#F8F6FF]"
                : "border-[#D9D9D9] hover:border-[#4F0DCE]"
            }`}
        >
          <h3 className="font-semibold text-[#373737] mb-1">I’m a Teacher</h3>
          <p className="text-[#6E6E6E] text-sm sm:text-base">
            Create polls, collect student responses, and view live results.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`w-[233px] h-[58px] px-8 py-2 rounded-full text-white font-medium transition
        bg-gradient-to-r from-[#7765DA] to-[#5767D0] 
        hover:opacity-90 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Continue
      </button>
    </div>
  );
};

export default Home;
