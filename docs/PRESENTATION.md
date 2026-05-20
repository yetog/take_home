# Task Manager - Technical Presentation

> Slide deck content for PowerPoint presentation

---

## Slide 1: Title

**Task Manager**
*A Full-Stack Containerized Application*

- **Candidate:** Isayah Young-Burke
- **Tech Stack:** FastAPI + React + TypeScript + Docker
- **Repository:** github.com/yetog/take_home

---

## Slide 2: Project Overview

**What I Built**

- RESTful API with 9 endpoints
- JWT-based authentication system
- React SPA with 3 main views
- Activity logging for audit trails
- Fully containerized with Docker Compose

**Time to Complete:** ~2 hours

---

## Slide 3: Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                      Docker Network                      │
│  ┌─────────────────┐         ┌─────────────────────┐    │
│  │    Frontend     │         │      Backend        │    │
│  │   React + TS    │  HTTP   │      FastAPI        │    │
│  │   Port 3000     │ ──────► │     Port 3001       │    │
│  │                 │  JSON   │                     │    │
│  │  • Login Page   │ ◄────── │  • /auth/login      │    │
│  │  • Task List    │   +     │  • /tasks CRUD      │    │
│  │  • Task Detail  │  JWT    │  • /tasks/stats     │    │
│  └─────────────────┘         │  • /tasks/{id}/...  │    │
│                              └─────────────────────┘    │
│                                        │                │
│                              ┌─────────▼─────────┐      │
│                              │  In-Memory Store  │      │
│                              │  (Dict + List)    │      │
│                              └───────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

*See `docs/ARCHITECTURE.md` for detailed diagram*

---

## Slide 4: Backend Highlights

**FastAPI Advantages**

- Automatic OpenAPI docs at `/docs`
- Pydantic validation on all requests
- Type hints = self-documenting code
- Async-ready (uvicorn)

**Key Design Decisions**

| Decision | Reasoning |
|----------|-----------|
| In-memory storage | Meets requirements, simple, fast |
| JWT over sessions | Stateless, scales horizontally |
| Activity logging | Audit trail without database |
| Toggle (not just complete) | Better UX for corrections |

---

## Slide 5: API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Returns JWT token |
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create task |
| `GET` | `/tasks/{id}` | Task detail |
| `PUT` | `/tasks/{id}` | Update title |
| `PUT` | `/tasks/{id}/complete` | Toggle status |
| `DELETE` | `/tasks/{id}` | Remove task |
| `GET` | `/tasks/stats` | Aggregated counts |
| `GET` | `/tasks/{id}/activity` | Change history |

**Interactive docs:** `http://localhost:3001/docs`

---

## Slide 6: Frontend Highlights

**React Architecture**

- **Context API** for auth state (no Redux needed)
- **React Router v6** for navigation
- **Protected Routes** redirect to login
- **Centralized API layer** with error handling

**User Experience**

- Loading states on every fetch
- Error banners (not alerts)
- Pagination (5 items/page)
- Responsive design (CSS-only, no framework)

---

## Slide 7: Authentication Flow

```
┌──────────┐     POST /auth/login      ┌──────────┐
│  Client  │ ─────────────────────────► │  Server  │
│          │   { email, password }      │          │
│          │                            │          │
│          │ ◄───────────────────────── │          │
│          │   { token: "eyJ..." }      │          │
└────┬─────┘                            └──────────┘
     │
     │  localStorage.setItem("token", ...)
     │
     ▼
┌──────────┐    GET /tasks              ┌──────────┐
│  Client  │ ─────────────────────────► │  Server  │
│          │  Authorization: Bearer ... │          │
│          │                            │          │
│          │ ◄───────────────────────── │          │
│          │   [ tasks array ]          │          │
└──────────┘                            └──────────┘
```

---

## Slide 8: Error Handling Strategy

**Backend (FastAPI)**

```python
# Consistent error format
raise HTTPException(
    status_code=404,
    detail="Task not found"
)
# Returns: {"detail": "Task not found"}
```

**Frontend (React)**

```typescript
// Central handler in api.ts
if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
}
```

**Result:** Graceful failures, automatic logout on token expiry

---

## Slide 9: Testing Approach

**8 Backend Tests Included**

1. `test_login_success` - Token returned
2. `test_login_missing_fields` - 400 on empty
3. `test_create_and_list_task` - CRUD works
4. `test_404_on_missing_task` - Proper errors
5. `test_complete_task_toggles_status` - Toggle logic
6. `test_stats_endpoint` - Aggregation correct
7. `test_activity_log_created` - Audit works
8. `test_unauthorized_without_token` - Auth enforced

**Run:** `cd backend && pytest test_main.py -v`

---

## Slide 10: Docker Setup

**docker-compose.yml**

```yaml
services:
  backend:
    build: ./backend
    ports: ["3001:3001"]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_API_URL=http://localhost:3001
    depends_on:
      - backend
```

**One command to run:**
```bash
docker-compose up --build
```

---

## Slide 11: What I'd Add With More Time

**1 Hour More**

- WebSocket for real-time updates
- Task due dates + calendar picker
- Server-side pagination
- Toast notifications

**Production-Ready**

- PostgreSQL persistence
- Redis for caching
- Bcrypt password hashing
- Refresh token rotation
- CI/CD pipeline

---

## Slide 12: Demo

**Live Demo Flow**

1. Start: `docker-compose up --build`
2. Login with any email/password
3. Create 3-4 tasks
4. Toggle completion on one
5. View task detail + activity log
6. Check stats update
7. Show Swagger docs at `/docs`

**Demo URL:** [Your hosted URL here]

---

## Slide 13: Key Takeaways

**Technical Strengths Demonstrated**

- Clean separation of concerns
- Type safety (Pydantic + TypeScript)
- Security best practices (JWT, validation)
- DevOps fluency (Docker, compose)
- Test-driven mindset

**Code Quality**

- Self-documenting with types
- Consistent error handling
- No over-engineering
- Production patterns (even for MVP)

---

## Slide 14: Questions?

**Repository:** github.com/yetog/take_home

**Contact:** [Your contact info]

**Thank you!**

---

# Speaker Notes

## Slide 2 Notes
- Mention the 2-hour time constraint upfront
- Emphasize choices made to stay focused (in-memory vs DB)

## Slide 4 Notes
- FastAPI chosen for auto-docs (shows professionalism)
- Toggle vs complete-only was a UX decision

## Slide 8 Notes
- Emphasize the 401 auto-logout - prevents stale sessions
- Show how frontend and backend error formats align

## Slide 11 Notes
- Be specific about what "more time" means
- Shows awareness of production needs without over-engineering the MVP

## Slide 12 Notes
- Have the demo pre-warmed (containers already running)
- Prepare 2-3 tasks in advance as backup
