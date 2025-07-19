import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { socket } from "../sockets/socket";

export const useBoardData = (token) => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (err) {
      toast.error("❌ Failed to fetch tasks!");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(data);
    } catch (err) {
      console.error("❌ Failed to fetch logs");
    }
  };

  useEffect(() => {
    if (!token) return;

    socket.connect();
    fetchTasks();
    fetchLogs();

    socket.on("taskUpdated", () => {
      fetchTasks();
      fetchLogs();
    });

    return () => {
      socket.off("taskUpdated");
      socket.disconnect();
    };
  }, [token]);

  return { tasks, logs, loading, fetchTasks, fetchLogs };
};
