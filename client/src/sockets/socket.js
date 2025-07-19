import { io } from "socket.io-client";

// ✅ Global socket instance
export const socket = io("https://to-do-borad.onrender.com", {
  autoConnect: false,
});
