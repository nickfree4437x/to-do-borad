import React from "react";
import { FaClock, FaUserCircle, FaHistory } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

const ActivityLog = ({ logs }) => {
  return (
    <div className="w-full lg:w-80 xl:w-96 h-full">
      <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <FiActivity className="text-indigo-500" />
            Activity Log
          </h2>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
            {logs.length} events
          </span>
        </div>

        {/* No logs case */}
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 p-6 text-center">
            <FaHistory className="text-4xl mb-3 opacity-30" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs mt-1">Actions will appear here</p>
          </div>
        ) : (
          <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-64">
            {logs.map((log) => (
              <li
                key={log._id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUserCircle className="text-indigo-500 text-lg" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-medium text-indigo-600">
                        {log.user?.name || "System"}
                      </span>{" "}
                      {log.action}{" "}
                      {log.task?.title && (
                        <span className="block truncate text-gray-500 mt-1">
                          "{log.task.title}"
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                      <FaClock className="opacity-70" />
                      <span>
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" • "}
                        {new Date(log.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          Real-time updates enabled
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
      `}</style>
    </div>
  );
};

export default ActivityLog;
