import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext } from "@hello-pangea/dnd";
import { FiPlus, FiLogOut, FiUser, FiRefreshCw, FiMenu, FiX } from "react-icons/fi";
import { socket } from "../sockets/socket";
import ConflictModal from "./ConflictModal";
import Column from "../Components/Column";
import ActivityLog from "../Components/ActivityLog";
import TaskModal from "../Components/TaskModal";

const Board = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://to-do-borad.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (err) {
      toast.error("Failed to fetch tasks!");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get("https://to-do-borad.onrender.com/api/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    socket.connect();
    fetchTasks();
    fetchLogs();

    socket.on("taskUpdated", () => {
      fetchTasks();
      fetchLogs();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.off("taskUpdated");
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setTimeout(() => (window.location.href = "/"), 1200);
  };

  const handleChange = (e) =>
    setTaskData({ ...taskData, [e.target.name]: e.target.value });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    try {
      await axios.post(
        "https://to-do-borad.onrender.com/api/tasks",
        { ...taskData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task created successfully!");
      setShowModal(false);
      setTaskData({ title: "", description: "", priority: "Medium" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task!");
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const { data } = await axios.put(
        `https://to-do-borad.onrender.com/api/tasks/${taskId}/smart-assign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message || "Task smart assigned!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Smart assign failed!");
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const statusMap = {
      Todo: "Todo",
      InProgress: "In Progress",
      Done: "Done",
    };

    try {
      await axios.put(
        `https://to-do-borad.onrender.com/api/tasks/${draggableId}/status`,
        { status: statusMap[destination.droppableId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      toast.error("Failed to update task status!");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`https://to-do-borad.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task!");
    }
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://to-do-borad.onrender.com/api/tasks/${editTask._id}`,
        { ...editTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task updated successfully!");
      setEditModal(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setEditModal(false);
        setConflictData({
          myVersion: editTask,
          serverVersion: err.response.data.serverTask,
        });
      } else {
        toast.error(err.response?.data?.message || "Failed to update task!");
      }
    }
  };

  return (
    <>
      <ToastContainer
        position={isMobile ? "top-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="shadow-lg"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4 md:p-6">
        {isMobile && (
          <div className="flex justify-between items-center mb-4 p-3 bg-white rounded-lg shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700"
              >
                {showSidebar ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <h1 className="text-lg font-bold text-gray-800">Task Board</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-lg bg-indigo-600 text-white"
              >
                <FiPlus size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-100 text-red-600"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'hidden' : 'block'}`}>
            {!isMobile && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-800">Welcome, {user?.name || "User"}</h1>
                      <p className="text-sm text-gray-500">Manage your team's tasks</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={fetchTasks}
                      className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base"
                    >
                      <FiRefreshCw className={loading ? "animate-spin" : ""} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base"
                    >
                      <FiPlus />
                      <span className="hidden sm:inline">Add Task</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base"
                    >
                      <FiLogOut />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className={`grid gap-3 sm:gap-4 ${isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  <Column title="Todo" droppableId="Todo" tasks={getTasksByStatus("Todo")} onEdit={openEditModal} onDelete={handleDelete} onSmartAssign={handleSmartAssign} colorClass="bg-blue-100" isMobile={isMobile} />
                  <Column title="In Progress" droppableId="InProgress" tasks={getTasksByStatus("In Progress")} onEdit={openEditModal} onDelete={handleDelete} onSmartAssign={handleSmartAssign} colorClass="bg-yellow-100" isMobile={isMobile} />
                  <Column title="Done" droppableId="Done" tasks={getTasksByStatus("Done")} onEdit={openEditModal} onDelete={handleDelete} onSmartAssign={handleSmartAssign} colorClass="bg-green-100" isMobile={isMobile} />
                </div>
              </DragDropContext>
            )}
          </div>

          <div className={`lg:w-80 xl:w-96 transition-all duration-300 ${isMobile ? (showSidebar ? 'block fixed inset-0 z-30 bg-white' : 'hidden') : 'block'}`}>
            <ActivityLog logs={logs} isMobile={isMobile} onClose={() => setShowSidebar(false)} />
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal
          title="Create New Task"
          taskData={taskData}
          setTaskData={setTaskData}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTask}
          isMobile={isMobile}
        />
      )}

      {editModal && (
        <TaskModal
          title="Edit Task"
          taskData={editTask || {}}
          setTaskData={setEditTask}
          onClose={() => setEditModal(false)}
          onSubmit={handleEditSubmit}
          isEdit={true}
          isMobile={isMobile}
        />
      )}

      {conflictData && (
        <ConflictModal
          myVersion={conflictData.myVersion}
          serverVersion={conflictData.serverVersion}
          onCancel={() => setConflictData(null)}
          onMerge={() => {
            const mergedTask = {
              ...conflictData.serverVersion,
              description: `${conflictData.serverVersion.description}\n---\n${conflictData.myVersion.description}`,
            };
            setEditTask(mergedTask);
            setConflictData(null);
          }}
          onOverwrite={async () => {
            await axios.put(
              `https://to-do-borad.onrender.com/api/tasks/${editTask._id}`,
              { ...conflictData.myVersion },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Overwritten successfully!");
            setConflictData(null);
            setEditModal(false);
          }}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default Board;
