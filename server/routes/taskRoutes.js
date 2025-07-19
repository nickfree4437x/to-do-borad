const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  changeTaskStatus,
  smartAssign
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Get + create tasks
router.route("/")
  .get(protect, getTasks)
  .post(protect, createTask);

// ✅ Edit + delete task
router.route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// ✅ Change task status (drag-drop)
router.put("/:id/status", protect, changeTaskStatus);

// ✅ Smart assign task
router.put("/:id/smart-assign", protect, smartAssign);

module.exports = router;
