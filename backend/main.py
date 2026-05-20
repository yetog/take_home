from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
from models import Task, TaskCreate, TaskUpdate, LoginRequest, StatsResponse, ActivityLog
from auth import create_token, verify_token

app = FastAPI(title="Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
tasks: dict[int, Task] = {}
activities: dict[int, list[ActivityLog]] = {}
next_id = 1


def log_activity(task_id: int, old_status: bool, new_status: bool):
    if task_id not in activities:
        activities[task_id] = []
    activities[task_id].append(ActivityLog(
        timestamp=datetime.now(),
        old_status=old_status,
        new_status=new_status
    ))


@app.post("/auth/login")
def login(data: LoginRequest):
    """Mock auth - accepts any email/password for demo purposes."""
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    token = create_token(data.email)
    return {"token": token}


@app.get("/tasks", response_model=List[Task])
def list_tasks(_: bool = Depends(verify_token)):
    """List all tasks."""
    return list(tasks.values())


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate, _: bool = Depends(verify_token)):
    """Create a new task."""
    global next_id
    if not task.title or not task.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    new_task = Task(
        id=next_id,
        title=task.title.strip(),
        completed=False,
        created_at=datetime.now()
    )
    tasks[next_id] = new_task
    log_activity(next_id, False, False)
    next_id += 1
    return new_task


@app.get("/tasks/stats", response_model=StatsResponse)
def get_stats(_: bool = Depends(verify_token)):
    """Return task statistics."""
    total = len(tasks)
    completed = sum(1 for t in tasks.values() if t.completed)
    return StatsResponse(total=total, completed=completed, pending=total - completed)


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int, _: bool = Depends(verify_token)):
    """Get a specific task by ID."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate, _: bool = Depends(verify_token)):
    """Update a task's title."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    if not task_update.title or not task_update.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    tasks[task_id].title = task_update.title.strip()
    return tasks[task_id]


@app.put("/tasks/{task_id}/complete", response_model=Task)
def toggle_complete(task_id: int, _: bool = Depends(verify_token)):
    """Toggle a task's completed status."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    task = tasks[task_id]
    old_status = task.completed
    task.completed = not task.completed
    log_activity(task_id, old_status, task.completed)
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, _: bool = Depends(verify_token)):
    """Delete a task."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
    if task_id in activities:
        del activities[task_id]
    return


@app.get("/tasks/{task_id}/activity", response_model=List[ActivityLog])
def get_activity(task_id: int, _: bool = Depends(verify_token)):
    """Get activity log for a task."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return activities.get(task_id, [])
