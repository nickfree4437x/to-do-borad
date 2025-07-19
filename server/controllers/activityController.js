const ActivityLog = require("../models/activityLogModel");

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "name email")
      .populate("task", "title");

    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

module.exports = { getActivityLogs };
