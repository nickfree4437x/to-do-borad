const ActivityLog = require("../models/activityLogModel");

const logActivity = async (userId, action, taskId = null) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      task: taskId,
    });
  } catch (err) {
    console.error("❌ Failed to log activity:", err.message);
  }
};

module.exports = logActivity;
