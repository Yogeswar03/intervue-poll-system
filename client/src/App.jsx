
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { socket } from "./socket";

import { setParticipants } from "./store/chatSlice";
import { resetStudent } from "./store/studentSlice";

import Home from "./components/Home";
import Teacher_page from "./components/Teacher/TeacherPage";
import TeacherLivePoll from "./components/Teacher/TeacherPoll";
import PollHistory from "./components/Teacher/PollHistory";
import GetStarted from "./components/Student/GetStarted";
import Loading from "./components/Student/Loading";
import WaitingNext from "./components/Student/WaitingScreen";
import KickedOut from "./components/Student/Kickout";
import Question from "./components/Student/Question";
import WaitingScreen from "./components/Student/WaitingScreen";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
   
    socket.connect();
    socket.on("kicked", () => {
      dispatch(resetStudent());
      navigate("/student/kicked");
    });

    socket.on("participants", (list) => {
      dispatch(setParticipants(list));
    });

    socket.on("connect", () => {
      console.log("✅ Connected with socket id:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err.message);
    });

    return () => {
      socket.off("kicked");
      socket.off("participants");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [dispatch, navigate]);

  return (
    <Routes>
     
      <Route path="/" element={<Home />} />
      <Route path="/teacher" element={<Teacher_page />} />
      <Route path="/teacher/live" element={<TeacherLivePoll />} />
      <Route path="/poll-history" element={<PollHistory />} />

      {/* Student routes */}
      <Route path="/student" element={<GetStarted />} />
      <Route path="/student/loading" element={<Loading />} />
      <Route path="/student/question" element={<Question />} />
      <Route path="/student/waiting" element={<WaitingScreen />} />
      <Route path="/student/kicked" element={<KickedOut />} />
    </Routes>
  );
}
