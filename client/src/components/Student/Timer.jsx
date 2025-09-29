// src/components/Timer.jsx
import React, { useEffect, useState } from "react";

const Timer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete(); // callback when timer ends
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  // Calculate percentage for progress bar
  const progress = (timeLeft / seconds) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Countdown Text */}
      <p className="text-center text-sm text-gray-600 mt-2">
        {timeLeft} sec left
      </p>
    </div>
  );
};

export default Timer;
