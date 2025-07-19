const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");

// ✅ Import Socket setup
const setupSocketIO = require("./utils/socket");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO from external file
const io = setupSocketIO(server);

// ✅ Attach io to app (for controllers)
app.set("io", io);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);

// Root route - for Render or health check
app.get("/", (req, res) => {
  res.json({ message: "API is working fine 🔥" });
});

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
