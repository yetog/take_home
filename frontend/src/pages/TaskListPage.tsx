import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchTasks,
  createTask,
  toggleComplete,
  deleteTask,
  fetchStats,
} from "../api";
import { Task, Stats } from "../types";
import { useAuth } from "../AuthContext";
import StatsCard from "../components/StatsCard";

const PAGE_SIZE = 5;

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });
  const [newTitle, setNewTitle] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, statsData] = await Promise.all([
        fetchTasks(),
        fetchStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await createTask(newTitle.trim());
      setNewTitle("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleComplete(id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const paginated = tasks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const maxPage = Math.max(0, Math.ceil(tasks.length / PAGE_SIZE) - 1);

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Task Manager</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <StatsCard stats={stats} />

      <form className="add-task-form" onSubmit={handleCreate}>
        <input
          className="input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "#6b7280" }}>
          No tasks yet. Create one above!
        </div>
      ) : (
        <>
          {paginated.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                className="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
              />
              <Link to={`/tasks/${task.id}`} className="task-title">
                {task.title}
              </Link>
              <div className="task-actions">
                <Link to={`/tasks/${task.id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {tasks.length > PAGE_SIZE && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {maxPage + 1}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= maxPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
