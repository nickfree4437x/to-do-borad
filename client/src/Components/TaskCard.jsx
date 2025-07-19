import { Draggable } from "@hello-pangea/dnd";
import { FiEdit2, FiTrash2, FiUserPlus, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

const TaskCard = ({ task, index, onEdit, onDelete, onSmartAssign, columnColor = "blue" }) => {
  // Color mapping based on column or priority
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", hover: "hover:bg-amber-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hover: "hover:bg-emerald-100" },
    High: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    Medium: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    Low: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" }
  };

  const priorityColors = colorMap[task.priority] || colorMap.Medium;
  const columnColors = colorMap[columnColor] || colorMap.blue;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: snapshot.isDragging ? 1.05 : 1
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-4 rounded-lg border ${priorityColors.border} cursor-grab relative overflow-hidden 
            ${snapshot.isDragging ? `${columnColors.bg} shadow-lg` : "bg-white"} 
            transition-all duration-200 mb-3`}
        >
          {/* Drag indicator */}
          <div className={`absolute top-0 left-0 h-full w-1 ${columnColors.bg}`}></div>

          {/* Title & Priority */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-gray-800 leading-tight">
              {task.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors.bg} ${priorityColors.text}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-3">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center">
            {/* Assigned User */}
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${task.assignedUser ? columnColors.bg : "bg-gray-100"}`}>
                <FiUser className={`${task.assignedUser ? columnColors.text : "text-gray-400"}`} size={14} />
              </div>
              <span className="text-xs text-gray-500">
                {task.assignedUser?.name || "Unassigned"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onSmartAssign(task._id);
                }}
                title="Smart Assign"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg ${columnColors.bg} ${columnColors.text} ${columnColors.hover} transition`}
              >
                <FiUserPlus size={14} />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                title="Edit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                <FiEdit2 size={14} />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                title="Delete"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
              >
                <FiTrash2 size={14} />
              </motion.button>
            </div>
          </div>

          {/* Drag handle for mobile */}
          <div className="absolute bottom-1 right-1 text-gray-300 text-xs">
            ⠿⠿
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskCard;