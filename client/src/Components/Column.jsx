import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { FiPlus } from "react-icons/fi";

const Column = ({ 
  title, 
  droppableId, 
  tasks, 
  onEdit, 
  onDelete, 
  onSmartAssign 
}) => {
  // Dynamic column colors based on status
  const columnColors = {
    Todo: {
      bg: "bg-blue-50",
      header: "from-blue-500 to-blue-600",
      border: "border-blue-100",
      empty: "border-blue-200"
    },
    InProgress: {
      bg: "bg-amber-50",
      header: "from-amber-500 to-amber-600",
      border: "border-amber-100",
      empty: "border-amber-200"
    },
    Done: {
      bg: "bg-emerald-50",
      header: "from-emerald-500 to-emerald-600",
      border: "border-emerald-100",
      empty: "border-emerald-200"
    }
  };

  const colors = columnColors[title] || columnColors.Todo;

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col rounded-xl shadow-sm transition-all duration-200 h-full
            ${snapshot.isDraggingOver ? `bg-gradient-to-b ${colors.bg} to-white` : colors.bg} 
            border ${colors.border} overflow-hidden min-h-[300px]`}
        >
          {/* Column Header */}
          <div className={`px-4 py-3 bg-gradient-to-r ${colors.header} text-white flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <h2 className="text-md font-semibold tracking-wide">{title}</h2>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            {title === "Todo" && (
              <button 
                className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded-full transition-all"
                onClick={() => onEdit({ status: title })}
              >
                <FiPlus size={14} />
              </button>
            )}
          </div>

          {/* Task List */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
            {tasks.length === 0 ? (
              <div className={`h-32 border-2 border-dashed ${colors.empty} rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center`}>
                <span className="text-xs bg-white px-2 py-1 rounded-full mb-2 shadow-sm">
                  {title === "Todo" ? "Add your first task" : "No tasks here"}
                </span>
                <span className="text-xs opacity-70">
                  {title === "Todo" ? "Click + to add" : "Drag tasks here"}
                </span>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSmartAssign={onSmartAssign}
                  columnColor={colors.header.split(' ')[0].replace('from-', '')}
                />
              ))
            )}
            {provided.placeholder}
          </div>

          {/* Custom scrollbar styles */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c7d2fe;
              border-radius: 10px;
            }
          `}</style>
        </div>
      )}
    </Droppable>
  );
};

export default Column;