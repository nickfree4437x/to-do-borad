import { io } from "socket.io-client";

// ✅ Global socket instance
export const socket = io("http://localhost:5000", {
  autoConnect: false,
});
