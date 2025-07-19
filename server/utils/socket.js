let activeUsers = new Map();

function setupSocketIO(server) {
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: "*", // later restrict to frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    const ip =
      socket.handshake.headers["x-forwarded-for"] ||
      socket.handshake.address ||
      "Unknown IP";

    console.log(`✅ User connected → ${socket.id} [${ip}]`);
    activeUsers.set(socket.id, ip);
    console.log(`👥 Active Users: ${activeUsers.size}`);

    // Optional → Track username after login
    socket.on("userJoined", (username) => {
      activeUsers.set(socket.id, username);
      console.log(`🙋 User Joined: ${username} (${socket.id})`);
      console.log(`👥 Active Users: ${activeUsers.size}`);
    });

    socket.on("disconnect", (reason) => {
      const userInfo = activeUsers.get(socket.id) || "Unknown User";

      let readableReason = reason;
      if (reason === "transport close") readableReason = "Network closed";
      else if (reason === "ping timeout") readableReason = "Connection timeout";
      else if (reason === "client namespace disconnect")
        readableReason = "Client requested disconnect";

      console.log(
        `❌ User disconnected → ${socket.id} (${userInfo}) [Reason: ${readableReason}]`
      );

      activeUsers.delete(socket.id);
      console.log(`👥 Active Users: ${activeUsers.size}`);
    });
  });

  return io;
}

module.exports = setupSocketIO;
