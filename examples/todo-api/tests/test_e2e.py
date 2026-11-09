"""E2E tests against the FastAPI test client (Phase 3).

These cover every observation in the spec's Section 6:
- Observation 1 (valid → 201 with id, created_at) and 3 (row in SQLite)
  are covered by test_create_todo_end_to_end.
- Observation 2 (empty → 422 title_required) is covered by
  test_empty_title_returns_422.
"""

from fastapi.testclient import TestClient

from src.db import get_conn
from src.main import app


def test_create_todo_end_to_end(tmp_path, monkeypatch):
    """Observation 1 + 3: valid title → 201; row appears in SQLite."""
    monkeypatch.setattr("src.db.DB_PATH", str(tmp_path / "todo.db"))
    client = TestClient(app)

    response = client.post("/todos", json={"title": "buy milk"})
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "buy milk"
    assert body["id"] > 0
    assert "T" in body["created_at"]

    conn = get_conn()
    row = conn.execute("SELECT title FROM todos WHERE id = ?", (body["id"],)).fetchone()
    conn.close()
    assert row == ("buy milk",)


def test_empty_title_returns_422(tmp_path, monkeypatch):
    """Observation 2: empty title → 422 with title_required."""
    monkeypatch.setattr("src.db.DB_PATH", str(tmp_path / "todo.db"))
    client = TestClient(app)

    response = client.post("/todos", json={"title": "   "})
    assert response.status_code == 422
    body = response.json()
    assert body["error"] == "title_required"
