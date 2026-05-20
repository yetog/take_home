import { Task, Stats, ActivityLog } from "./types";

// In production, API is proxied through nginx at /task-manager/api
// In development, use localhost:3001 directly
const API_BASE = process.env.REACT_APP_API_URL || "/task-manager/api";

export const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    // Use relative path to respect any base path configuration
    const basePath = process.env.PUBLIC_URL || "";
    window.location.href = `${basePath}/login`;
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const fetchTasks = (): Promise<Task[]> =>
  fetch(`${API_BASE}/tasks`, { headers: authHeaders() }).then(handleResponse);

export const createTask = (title: string): Promise<Task> =>
  fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  }).then(handleResponse);

export const fetchTask = (id: number): Promise<Task> =>
  fetch(`${API_BASE}/tasks/${id}`, { headers: authHeaders() }).then(handleResponse);

export const updateTask = (id: number, title: string): Promise<Task> =>
  fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  }).then(handleResponse);

export const toggleComplete = (id: number): Promise<Task> =>
  fetch(`${API_BASE}/tasks/${id}/complete`, {
    method: "PUT",
    headers: authHeaders(),
  }).then(handleResponse);

export const deleteTask = (id: number): Promise<null> =>
  fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then(handleResponse);

export const fetchStats = (): Promise<Stats> =>
  fetch(`${API_BASE}/tasks/stats`, { headers: authHeaders() }).then(handleResponse);

export const fetchActivity = (id: number): Promise<ActivityLog[]> =>
  fetch(`${API_BASE}/tasks/${id}/activity`, { headers: authHeaders() }).then(handleResponse);
