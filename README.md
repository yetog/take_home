# Task Manager

A full-stack task management application built with **FastAPI** (Python) and **React** (TypeScript), containerized with Docker.

## Features

- User authentication with JWT tokens
- Full CRUD operations for tasks
- Task completion toggling with activity logging
- Real-time statistics (total, completed, pending)
- Paginated task list
- Detailed task view with activity history
- Responsive UI with clean design

## Tech Stack

- **Backend:** FastAPI, Pydantic, PyJWT, Uvicorn
- **Frontend:** React 18, TypeScript, React Router v6
- **Infrastructure:** Docker, Docker Compose

## How to Build and Run

```bash
# Clone the repository and navigate to the project
cd task-manager

# Build and start both services
docker-compose up --build
```

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/docs (Swagger UI)

### Login

Use any email/password combination to log in (authentication is mocked for demo purposes).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate and receive JWT token |
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/{id}` | Get task details |
| PUT | `/tasks/{id}` | Update task title |
| PUT | `/tasks/{id}/complete` | Toggle task completion |
| DELETE | `/tasks/{id}` | Delete a task |
| GET | `/tasks/stats` | Get task statistics |
| GET | `/tasks/{id}/activity` | Get task activity log |

## Running Tests

```bash
cd backend
pip install -r requirements.txt
pytest test_main.py -v
```

---

## Assumptions / Simplifications

1. **Mocked Authentication** - Any email/password combination returns a valid JWT. In production, this would use a real user database with bcrypt password hashing.

2. **In-Memory Storage** - Task data is stored in Python dictionaries and resets when the backend container restarts. For persistence, this could be swapped for PostgreSQL or Redis.

3. **No Refresh Tokens** - The JWT remains valid until the backend restarts. Production would implement refresh token rotation.

4. **Client-Side Pagination** - All tasks are fetched and paginated on the frontend. For large datasets, server-side pagination with `?page=1&limit=10` would be more efficient.

5. **CORS Configured for localhost** - Only `http://localhost:3000` is allowed. Production would use environment-based origins.

---

## How did you handle API errors?

### Backend
- **FastAPI HTTPException** - All errors return proper status codes (400, 401, 404) with descriptive `detail` messages
- **Pydantic validation** - Request bodies are automatically validated; invalid data returns 422 with field-level errors
- **Consistent error format** - All errors follow `{"detail": "Error message"}` structure

### Frontend
- **Central error handler** - `handleResponse()` in `api.ts` checks status codes and throws meaningful errors
- **401 handling** - Unauthorized responses clear the token and redirect to `/login`
- **Error state** - Each page maintains an `error` state that displays a styled error banner
- **Loading states** - Spinners shown during API calls; disabled buttons prevent double-submission

---

## What tests would you write if given more time?

### Backend (pytest)
- **Unit tests for each endpoint:**
  - Login returns token, rejects empty credentials
  - CRUD operations return correct status codes
  - 404 on non-existent task IDs
  - 401 when token is missing or invalid
- **Activity log tests:**
  - Verify log entries created on status changes
  - Verify logs deleted with task
- **Integration tests:**
  - Full flow: login → create → update → complete → stats → delete
  - Concurrent request handling (next_id race conditions)

### Frontend (React Testing Library)
- **LoginPage:**
  - Form validation rejects empty fields
  - Successful login redirects to task list
  - Failed login shows error message
- **TaskListPage:**
  - Renders tasks from API
  - Create form adds task to list
  - Toggle checkbox updates completion
  - Pagination buttons disable correctly
- **TaskDetailPage:**
  - Loads and displays task data
  - Edit form saves changes
  - Activity log renders entries

---

## What would you improve with 1 extra hour?

1. **WebSocket Integration** - Push real-time task updates to all connected clients so multiple users see changes instantly without refreshing.

2. **Task Due Dates + Filtering** - Add `due_date` field with calendar picker, and filter/sort options (by status, date, alphabetical).

3. **Server-Side Pagination** - Add `?limit=10&offset=0` parameters to `/tasks` endpoint for better performance with large datasets.

4. **Better UX Polish:**
   - Toast notifications instead of inline errors
   - Optimistic UI updates with rollback on failure
   - Keyboard shortcuts (Enter to save, Escape to cancel)
   - Dark mode toggle

5. **Proper User Accounts** - Real user registration with bcrypt password hashing, email validation, and refresh token rotation.

---

## Bonus Features Included

1. **Auto-generated API Documentation** - FastAPI provides interactive Swagger UI at `/docs`
2. **Activity Log Timeline** - Track all status changes with timestamps
3. **JWT Authentication** - Proper token-based auth with protected routes
4. **Clean, Responsive UI** - Modern styling without heavy frameworks
5. **Comprehensive Test Suite** - 8 pytest tests covering core functionality

---

## Project Structure

```
task-manager/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic schemas
│   ├── auth.py           # JWT utilities
│   ├── test_main.py      # Pytest tests
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api.ts        # API client
│   │   ├── AuthContext.tsx
│   │   ├── App.tsx       # Routes
│   │   ├── types.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── TaskListPage.tsx
│   │   │   └── TaskDetailPage.tsx
│   │   └── components/
│   │       └── StatsCard.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

**Live Demo:** https://zaylegend.com/task-manager/

**Author:** Isayah Young-Burke
**Built with:** FastAPI + React + TypeScript + Docker
