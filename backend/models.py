from pydantic import BaseModel
from datetime import datetime
from typing import List

class Task(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    title: str

class LoginRequest(BaseModel):
    email: str
    password: str

class StatsResponse(BaseModel):
    total: int
    completed: int
    pending: int

class ActivityLog(BaseModel):
    timestamp: datetime
    old_status: bool
    new_status: bool
