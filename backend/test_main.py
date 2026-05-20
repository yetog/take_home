from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_auth_header():
    """Helper to get auth token for tests."""
    res = client.post("/auth/login", json={"email": "test@test.com", "password": "pass"})
    token = res.json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_login_success():
    """Test successful login returns token."""
    res = client.post("/auth/login", json={"email": "test@test.com", "password": "pass"})
    assert res.status_code == 200
    assert "token" in res.json()


def test_login_missing_fields():
    """Test login fails with missing fields."""
    res = client.post("/auth/login", json={"email": "", "password": ""})
    assert res.status_code == 400


def test_create_and_list_task():
    """Test creating a task and listing it."""
    headers = get_auth_header()
    res = client.post("/tasks", json={"title": "Test task"}, headers=headers)
    assert res.status_code == 201
    task_id = res.json()["id"]

    res = client.get("/tasks", headers=headers)
    assert res.status_code == 200
    assert any(t["id"] == task_id for t in res.json())


def test_404_on_missing_task():
    """Test 404 returned for non-existent task."""
    headers = get_auth_header()
    res = client.get("/tasks/9999", headers=headers)
    assert res.status_code == 404
    assert res.json()["detail"] == "Task not found"


def test_complete_task_toggles_status():
    """Test toggling task completion."""
    headers = get_auth_header()
    res = client.post("/tasks", json={"title": "Toggle test"}, headers=headers)
    task_id = res.json()["id"]

    # Initially not completed
    assert res.json()["completed"] is False

    # Toggle to completed
    res = client.put(f"/tasks/{task_id}/complete", headers=headers)
    assert res.json()["completed"] is True

    # Toggle back to not completed
    res = client.put(f"/tasks/{task_id}/complete", headers=headers)
    assert res.json()["completed"] is False


def test_stats_endpoint():
    """Test stats returns correct counts."""
    headers = get_auth_header()
    res = client.get("/tasks/stats", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total" in data
    assert "completed" in data
    assert "pending" in data
    assert data["total"] == data["completed"] + data["pending"]


def test_activity_log_created():
    """Test activity log tracks status changes."""
    headers = get_auth_header()
    res = client.post("/tasks", json={"title": "Activity test"}, headers=headers)
    task_id = res.json()["id"]

    # Toggle status
    client.put(f"/tasks/{task_id}/complete", headers=headers)

    # Check activity log
    res = client.get(f"/tasks/{task_id}/activity", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1


def test_unauthorized_without_token():
    """Test endpoints require authentication."""
    res = client.get("/tasks")
    assert res.status_code == 403  # HTTPBearer returns 403 when no credentials
