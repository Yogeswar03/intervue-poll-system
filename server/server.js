
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let currentPoll = null;
let pollResults = [];
let participants = {};
let answeredBy = new Set(); 


io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("getCurrentPoll", () => {
    if (currentPoll) {
      socket.emit("pollStarted", currentPoll);
      socket.emit("pollResults", pollResults);
      socket.emit("pollStatus", {
        answeredCount: answeredBy.size,
        totalParticipants: Object.keys(participants).length,
      });
    }
  });
  socket.on("join", ({ name, role }) => {
    const safeName = name || "Anonymous";
    const safeRole = role || "student";

    participants[socket.id] = { name: safeName, role: safeRole };

    io.emit(
      "participants",
      Object.values(participants).map((p) => p.name)
    );

    console.log("🙋 Joined:", safeName, safeRole);
  });

  socket.on("startPoll", (poll) => {
    const totalStudents = Object.values(participants).filter(
      (p) => p.role === "student"
    ).length;

    if (currentPoll && answeredBy.size < totalStudents) {
      socket.emit(
        "errorMessage",
        "⚠️ Cannot start a new poll until all students have answered or the current poll is ended."
      );
      return;
    }

    currentPoll = poll;
    pollResults = new Array(poll.options.length).fill(0);
    answeredBy = new Set();

    io.emit("pollStarted", poll);
    io.emit("pollResults", pollResults);
    io.emit("pollStatus", {
      answeredCount: answeredBy.size,
      totalParticipants: totalStudents,
    });

    console.log("📢 Poll started:", poll);
  });

  socket.on("submitAnswer", ({ studentName, optionIndex }) => {
    if (!currentPoll) return;
    if (optionIndex == null) return;

    if (pollResults[optionIndex] !== undefined) {
      const prev = socket.lastAnswer;
      if (typeof prev === "number" && pollResults[prev] !== undefined) {
        pollResults[prev] = Math.max(0, pollResults[prev] - 1);
      }

      pollResults[optionIndex] += 1;
      socket.lastAnswer = optionIndex;

      if (studentName) answeredBy.add(studentName);

      io.emit("pollResults", pollResults);
      io.emit("pollStatus", {
        answeredCount: answeredBy.size,
        totalParticipants: Object.values(participants).filter(
          (p) => p.role === "student"
        ).length,
      });

      console.log(
        `🗳 ${studentName} voted for option ${optionIndex}`,
        pollResults
      );
    }
  });

  socket.on("endPoll", () => {
    io.emit("pollEnded", { poll: currentPoll, results: pollResults });
    console.log("🛑 Poll ended:", currentPoll, pollResults);

    currentPoll = null;
    pollResults = [];
    answeredBy = new Set();
  });

  socket.on("chatMessage", ({ sender, text }) => {
    io.emit("chatMessage", { sender, text });
    console.log("💬 Chat:", sender, text);
  });

  socket.on("kick", (name) => {
    const target = Object.keys(participants).find(
      (id) => participants[id]?.name === name
    );

    if (target) {
      io.to(target).emit("kicked");
      io.sockets.sockets.get(target)?.disconnect(true);

      delete participants[target];
      io.emit(
        "participants",
        Object.values(participants).map((p) => p.name)
      );
      console.log(`❌ ${name} was kicked out.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    delete participants[socket.id];
    io.emit(
      "participants",
      Object.values(participants).map((p) => p.name)
    );
  });
});

httpServer.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
