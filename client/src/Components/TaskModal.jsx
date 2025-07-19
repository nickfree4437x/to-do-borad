import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const TaskModal = ({
  title,
  taskData,
  setTaskData,
  onClose,
  onSubmit,
  isEdit = false,
}) => {
  // Priority options with icons and colors
  const priorityOptions = [
    { value: "Low", label: "Low Priority", icon: <FiCheckCircle className="text-emerald-500" />, bg: "bg-emerald-50", text: "text-emerald-600" },
    { value: "Medium", label: "Medium Priority", icon: <FiAlertCircle className="text-amber-500" />, bg: "bg-amber-50", text: "text-amber-600" },
    { value: "High", label: "High Priority", icon: <FiAlertTriangle className="text-red-500" />, bg: "bg-red-50", text: "text-red-600" }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="p-5 space-y-4">
            {/* Title Field */}
            <div>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={taskData?.title || ""}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <textarea
                placeholder="Add details, notes or links..."
                value={taskData?.description || ""}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>

            {/* Priority Selector */}
            <div>
              <div className="grid grid-cols-3 gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTaskData({ ...taskData, priority: option.value })}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                      taskData?.priority === option.value
                        ? `${option.bg} border-transparent ring-2 ring-indigo-200`
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {option.icon}
                    <span className={`text-sm ${taskData?.priority === option.value ? option.text : "text-gray-600"}`}>
                      {option.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all ${
                  isEdit
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isEdit ? "Update Task" : "Create Task"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;