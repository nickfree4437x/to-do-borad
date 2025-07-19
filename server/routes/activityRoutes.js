const express = require("express");
const { getActivityLogs } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getActivityLogs);

module.exports = router;
