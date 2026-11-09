"""Integration tests for the todos context (Phase 2, TDD seed).

Covers T-1 through T-5 from spec v0.1.3 §4. Uses the FastAPI TestClient
(HTTP layer) with a temp-file SQLite database, matching the 'integration'
typing in the spec (T-*: "POST → 201/422").

Strong assertions per Navigator overrides O3-O5 in audit.4.md:
- O3: T-1 asserts response `id` equals the persisted row's `id`.
- O4: T-2 and T-3 assert `error == "title_required"` exactly (not just
  "has an error field").
- O5: T-1 asserts `created_at` is within 60 seconds of `now()` (freshness),
  not just that it parses as ISO 8601.

These assertions are deliberately stronger than the spec's T-1/T-2/T-3
descriptions. A weaker implementation would fail them:
- An implementation that returns an unrelated `id` (e.g., a constant) fails O3.
- An implementation that returns `error: "validation_failed"` fails O4.
- An implementation that returns a hardcoded or stale timestamp fails O5.
"""

import sqlite3
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

from src.db import SCHEMA
from src.main import app


@pytest.fixture
def todo_env(tmp_path, monkeypatch):
    """Isolated DB file + TestClient per test.

    Monkeypatches src.db.DB_PATH so the app's get_conn() opens the temp DB.
    Pre-creates the schema so tests that inspect the DB directly don't
    depend on get_conn() having run.
    """
    db_path = str(tmp_path / "todo.db")
    monkeypatch.setattr("src.db.DB_PATH", db_path)

    conn = sqlite3.connect(db_path)
    conn.executescript(SCHEMA)
    conn.commit()
    conn.close()

    return TestClient(app), db_path


def _rows(db_path: str) -> list:
    conn = sqlite3.connect(db_path)
    try:
        return conn.execute(
            "SELECT id, title, created_at FROM todos ORDER BY id"
        ).fetchall()
    finally:
        conn.close()


# T-1 / AC-1: valid title -> 201, positive id matching row, title equals
# input, created_at ISO 8601 UTC and fresh.
def test_create_valid_todo(todo_env):
    client, db_path = todo_env
    response = client.post("/todos", json={"title": "buy milk"})

    assert response.status_code == 201
    body = response.json()

    # id: positive int (AC-1)
    assert isinstance(body["id"], int)
    assert body["id"] > 0

    # title: equals input (AC-1)
    assert body["title"] == "buy milk"

    # created_at: parseable ISO 8601, UTC, within 60s (AC-1 + O5 freshness)
    created = datetime.fromisoformat(body["created_at"])
    assert created.tzinfo is not None
    assert created.utcoffset() == timedelta(0)
    now = datetime.now(timezone.utc)
    assert abs((now - created).total_seconds()) < 60

    # O3: id matches the persisted row, title matches, timestamps agree
    rows = _rows(db_path)
    assert len(rows) == 1
    row_id, row_title, row_created_at = rows[0]
    assert row_id == body["id"]
    assert row_title == "buy milk"
    assert row_created_at == body["created_at"]


# T-2 / AC-2: empty title -> 422 with error == "title_required",
# non-empty detail, no row inserted.
def test_create_empty_title_rejected(todo_env):
    client, db_path = todo_env
    response = client.post("/todos", json={"title": ""})

    assert response.status_code == 422
    body = response.json()

    # O4: exact error code (stronger than "has error field")
    assert body["error"] == "title_required"
    assert isinstance(body["detail"], str)
    assert body["detail"]

    # AC-2: no row inserted
    assert _rows(db_path) == []


# T-3 / AC-2: whitespace-only title -> 422 with error == "title_required",
# non-empty detail, no row inserted.
def test_create_whitespace_title_rejected(todo_env):
    client, db_path = todo_env
    response = client.post("/todos", json={"title": "   "})

    assert response.status_code == 422
    body = response.json()

    # O4: exact error code
    assert body["error"] == "title_required"
    assert isinstance(body["detail"], str)
    assert body["detail"]

    # AC-2: no row inserted
    assert _rows(db_path) == []


# T-4 / AC-3: title with surrounding whitespace -> 201, stripped in body
# and in the persisted row.
def test_create_title_with_whitespace_stripped(todo_env):
    client, db_path = todo_env
    response = client.post("/todos", json={"title": "  buy milk  "})

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "buy milk"

    rows = _rows(db_path)
    assert len(rows) == 1
    assert rows[0][1] == "buy milk"


# T-5 / AC-4: clean title -> 201, strip() is a no-op (body and row retain
# the exact input, no characters changed).
def test_create_clean_title_is_noop_strip(todo_env):
    client, db_path = todo_env
    input_title = "buy milk"
    response = client.post("/todos", json={"title": input_title})

    assert response.status_code == 201
    body = response.json()
    # No-op: input == output, character-for-character
    assert body["title"] == input_title

    rows = _rows(db_path)
    assert len(rows) == 1
    assert rows[0][1] == input_title
