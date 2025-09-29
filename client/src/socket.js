// src/socket.js
import { io } from "socket.io-client";


// Use environment variable for flexibility (falls back to localhost:4000)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

// Create socket instance but don't connect immediately
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // prevents duplicate connections in React StrictMode
});
