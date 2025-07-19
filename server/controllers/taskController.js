const Task = require("../models/Task");
const User = require("../models/User"); // ✅ for Smart Assign
const logActivity  = require("../utils/logActivity");


// ✅ GET all tasks (shared board for all users)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find() // 🔄 removed user-specific filter
      .populate("assignedUser", "name");

    res.json(tasks);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ✅ CREATE new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // 🚫 1. Column name जैसा title नहीं होना चाहिए
    const forbiddenTitles = ["todo", "in progress", "done"];
    if (forbiddenTitles.includes(title.trim().toLowerCase())) {
      return res.status(400).json({ message: "❌ Task title cannot match column names!" });
    }

    // 🚫 2. Title unique होना चाहिए (पूरे board में)
    const existingTask = await Task.findOne({ title: title.trim() });
    if (existingTask) {
      return res.status(400).json({ message: "❌ Task title must be unique!" });
    }

    // ✅ नया Task बनाओ
    const newTask = await Task.create({
      title: title.trim(),
      description,
      priority,
      status: "Todo",
      createdBy: req.user._id,
    });

    logActivity(req.user._id, `Created task "${title}"`, newTask._id);

    const io = req.app.get("io");
    io.emit("taskUpdated", { message: `New task created: ${title}`, task: newTask });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Task Creation Error:", err.message);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// ✅ UPDATE task with Conflict Handling
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assignedUser, lastUpdated } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🚨 Conflict check: अगर DB का updatedAt > lastUpdated
    if (lastUpdated && new Date(lastUpdated) < new Date(task.updatedAt)) {
      return res.status(409).json({
        message: "Conflict detected! Task was updated by someone else.",
        serverTask: task,
      });
    }

    // 🚫 Column name जैसे title नहीं होना चाहिए
    const forbiddenTitles = ["todo", "in progress", "done"];
    if (forbiddenTitles.includes(title.trim().toLowerCase())) {
      return res.status(400).json({ message: "❌ Task title cannot match column names!" });
    }

    // 🚫 Title unique होना चाहिए (लेकिन खुद को छोड़कर)
    const existingTask = await Task.findOne({
      title: title.trim(),
      _id: { $ne: id },
    });
    if (existingTask) {
      return res.status(400).json({ message: "❌ Task title must be unique!" });
    }

    // ✅ Update Task
    task.title = title.trim();
    task.description = description;
    task.priority = priority;
    task.status = status;
    task.assignedUser = assignedUser;
    await task.save();

    logActivity(req.user._id, `Updated task "${task.title}"`, task._id);

    const io = req.app.get("io");
    io.emit("taskUpdated", { message: `Task updated: ${task.title}`, task });

    res.json(task);
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};


// ✅ DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    logActivity(req.user._id, `Deleted task "${deletedTask.title}"`, deletedTask._id);

    const io = req.app.get("io");
    io.emit("taskUpdated", { message: `Task deleted: ${deletedTask.title}`, taskId: id });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// ✅ CHANGE STATUS (drag & drop)
exports.changeTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();

    logActivity(req.user._id, `Moved task "${task.title}" to ${status}`, task._id);

    const io = req.app.get("io");
    io.emit("taskUpdated", { message: `Task moved: ${task.title} → ${status}`, task });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to change task status" });
  }
};

// ✅ SMART ASSIGN (auto assign least busy user)
exports.smartAssign = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Get all users
    const users = await User.find({}, "_id name");
    if (!users.length) return res.status(400).json({ message: "No users found" });

    // ✅ Count active tasks for each user
    let userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({
          assignedUser: user._id,
          status: { $ne: "Done" },
        });
        return { userId: user._id, count };
      })
    );

    // ✅ Find least busy user
    userTaskCounts.sort((a, b) => a.count - b.count);
    const leastBusyUser = userTaskCounts[0].userId;

    // ✅ Assign task
    task.assignedUser = leastBusyUser;
    await task.save();

    logActivity(req.user._id, `Smart assigned task "${task.title}"`, task._id);

    const io = req.app.get("io");
    io.emit("taskUpdated", { message: `Smart assigned: ${task.title}`, task });

    res.json({ message: "Task smart assigned", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to smart assign task" });
  }
};
