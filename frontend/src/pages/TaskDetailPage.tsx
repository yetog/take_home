import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchTask,
  fetchActivity,
  updateTask,
  toggleComplete,
  deleteTask,
} from "../api";
import { Task, ActivityLog } from "../types";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [taskData, activityData] = await Promise.all([
        fetchTask(Number(id)),
        fetchActivity(Number(id)),
      ]);
      setTask(taskData);
      setActivity(activityData);
      setEditTitle(taskData.title);
    } catch (err: any) {
      setError(err.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    try {
      setSaving(true);
      await updateTask(Number(id), editTitle.trim());
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleComplete(Number(id));
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(Number(id));
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const formatStatus = (status: boolean) => {
    return status ? "Completed" : "Pending";
  };

  if (loading) {
    return <div className="loading">Loading task...</div>;
  }

  if (!task) {
    return (
      <div className="container">
        <div className="error">Task not found</div>
        <Link to="/" className="back-link">
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to Tasks
      </Link>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Task Detail</h1>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Title</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className="input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || editTitle === task.title}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: task.completed ? "#10b981" : "#f59e0b",
                fontWeight: "bold",
              }}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </p>
          <p>
            <strong>Created:</strong> {formatDate(task.created_at)}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn ${task.completed ? "btn-secondary" : "btn-success"}`}
            onClick={handleToggle}
          >
            {task.completed ? "Mark Pending" : "Mark Complete"}
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Task
          </button>
        </div>
      </div>

      <div className="card activity-log">
        <h3 style={{ marginBottom: "1rem" }}>Activity Log</h3>
        {activity.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No activity recorded yet.</p>
        ) : (
          activity.map((log, index) => (
            <div key={index} className="activity-item">
              <strong>{formatDate(log.timestamp)}</strong>
              <br />
              {formatStatus(log.old_status)} → {formatStatus(log.new_status)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
