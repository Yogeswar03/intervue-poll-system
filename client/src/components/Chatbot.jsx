// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePopup,
  setActiveTab,
  addMessage as addMessageLocal,
  setParticipants as setParticipantsLocal,
} from "../store/chatSlice";
import { socket } from "../socket";

const Chatbot = ({ isTeacher = false, collapsed = false }) => {
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.chat.showPopup);
  const activeTab = useSelector((state) => state.chat.activeTab);
  const messages = useSelector((state) => state.chat.messages);
  const participants = useSelector((state) => state.chat.participants);
  const studentName = useSelector((state) => state.student.name);

  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  // ✅ Socket listeners
  useEffect(() => {
    const handleChatMessage = ({ sender, text }) => {
      dispatch(addMessageLocal({ id: Date.now(), sender, text }));
    };

    const handleParticipants = (list) => {
      dispatch(setParticipantsLocal(list));
    };

    const handleKicked = () => {
      socket.disconnect();
      window.location.href = "/student/kicked";
    };

    socket.on("chatMessage", handleChatMessage);
    socket.on("participants", handleParticipants);
    socket.on("kicked", handleKicked);

    return () => {
      socket.off("chatMessage", handleChatMessage);
      socket.off("participants", handleParticipants);
      socket.off("kicked", handleKicked);
    };
  }, [dispatch]);

  // ✅ Scroll detection
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - (container.scrollTop + container.clientHeight);

      if (distanceFromBottom <= 50) {
        setIsAtBottom(true);
        setNewMessageAlert(false);
      } else {
        setIsAtBottom(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Auto-scroll when at bottom, else show "↓ New"
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (isAtBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      setNewMessageAlert(true);
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setNewMessageAlert(false);
    setIsAtBottom(true);
  };

  const handleSendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    const sender = isTeacher ? "Teacher" : studentName || "Student";

    socket.emit("chatMessage", { sender, text });

    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKick = (name) => {
    if (!isTeacher) return;
    socket.emit("kick", name);
  };

  return (
    <>
      {!collapsed && (
        <button
          className="fixed bottom-5 right-5 bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white p-3 rounded-full shadow-lg"
          onClick={() => dispatch(togglePopup())}
        >
          💬
        </button>
      )}

      {showPopup && (
        <div className="fixed bottom-20 right-6 bg-white w-80 h-96 rounded-lg shadow-xl flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 font-medium ${
                activeTab === "chat"
                  ? "border-b-2 border-[#4F0DCE] text-[#4F0DCE]"
                  : "text-[#6E6E6E]"
              }`}
              onClick={() => dispatch(setActiveTab("chat"))}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 font-medium ${
                activeTab === "participants"
                  ? "border-b-2 border-[#4F0DCE] text-[#4F0DCE]"
                  : "text-[#6E6E6E]"
              }`}
              onClick={() => dispatch(setActiveTab("participants"))}
            >
              Participants
            </button>
          </div>

          {activeTab === "chat" && (
            <div className="flex flex-col flex-1 relative">
              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-2"
                ref={messagesContainerRef}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-md max-w-[70%] ${
                      msg.sender === (isTeacher ? "Teacher" : studentName)
                        ? "bg-[#F2F2F2] self-end text-right ml-auto"
                        : "bg-[#E0E0E0] self-start"
                    }`}
                  >
                    <p className="text-xs font-semibold">{msg.sender}</p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* ↓ New button */}
              {newMessageAlert && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-16 right-3 bg-[#4F0DCE] text-white text-xs px-3 py-1 rounded-full shadow"
                >
                  ↓ New
                </button>
              )}

              {/* Force Scroll button */}
              {!isAtBottom && (
                <button
                  onClick={scrollToBottom}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow"
                >
                  Force Scroll
                </button>
              )}

              {/* Input */}
              <div className="p-2 border-t flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none"
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <div className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-2">
                {participants.map((p, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-[#F2F2F2] p-2 rounded-md text-[#373737] text-sm"
                  >
                    <span>{p}</span>
                    {isTeacher && p !== "Teacher" && (
                      <button
                        onClick={() => handleKick(p)}
                        className="text-red-500 text-xs font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
