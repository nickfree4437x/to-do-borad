import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConflictModal = ({ myVersion, serverVersion, onMerge, onOverwrite, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* ✅ Animated Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <h2 className="text-xl font-bold text-red-600">
              Conflict Detected
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4">
          Someone else updated this task while you were editing. Please compare
          both versions and decide how to proceed.
        </p>

        {/* Versions Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Your Version */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-700 mb-2">📝 Your Version</h3>
            <p className="text-sm"><b>Title:</b> {myVersion.title}</p>
            <p className="text-sm"><b>Description:</b> {myVersion.description}</p>
            <p className="text-sm"><b>Priority:</b> {myVersion.priority}</p>
          </div>

          {/* Server Version */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-700 mb-2">🌐 Server Version</h3>
            <p className="text-sm"><b>Title:</b> {serverVersion.title}</p>
            <p className="text-sm"><b>Description:</b> {serverVersion.description}</p>
            <p className="text-sm"><b>Priority:</b> {serverVersion.priority}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={onMerge}
          >
            Merge Versions
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onOverwrite}
          >
            Overwrite Server
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConflictModal;
