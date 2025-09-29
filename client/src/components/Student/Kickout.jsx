import React from "react";
import { useNavigate } from "react-router-dom";

const Kickout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-500">
          You’ve been Kicked out!
        </h1>
        <p className="text-gray-600">
          Looks like the teacher removed you from the poll system.
          <br />
          Please try again sometime.
        </p>
        <button
          onClick={() => navigate("/student")}
          className="mt-6 px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Kickout;
