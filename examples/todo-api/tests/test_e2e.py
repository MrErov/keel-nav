"""E2E tests for Phase 3 — covers the 4 observations in v0.1.3 §6.

v0.1.3 §6 (Observation Notes):
  1. `id` values increase monotonically: 1, 2, 3, ...
  2. Two POSTs more than 1 second apart produce distinct `created_at`.
  3. A 422 response contains no `id` field (no row created).
  4. Response time for a valid POST is under 200ms (informational).

These tests use TestClient + a real file-backed SQLite per test. That is
the same infrastructure as Phase 2's test_todos.py, because the app has
no external dependencies to mock. The Phase 2 / Phase 3 distinction here
is: Phase 2 tests cover the ACs (T-1..T-5), Phase 3 tests cover the §6
observations (what a human should *see* beyond the ACs).
"""

import sqlite3
import time
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient

from src.db import SCHEMA
from src.main import app


@pytest.fixture
def e2e_env(tmp_path, monkeypatch):
    db_path = str(tmp_path / "todo.db")
    monkeypatch.setattr("src.db.DB_PATH", db_path)
    conn = sqlite3.connect(db_path)
    conn.executescript(SCHEMA)
    conn.commit()
    conn.close()
    return TestClient(app), db_path


def _ids_in_db(db_path: str) -> list:
    conn = sqlite3.connect(db_path)
    try:
        return [r[0] for r in conn.execute("SELECT id FROM todos ORDER BY id")]
    finally:
        conn.close()


def _titles_in_db(db_path: str) -> list:
    conn = sqlite3.connect(db_path)
    try:
        return [r[0] for r in conn.execute("SELECT title FROM todos ORDER BY id")]
    finally:
        conn.close()


# Observation 1 — id monotonicity
def test_observation_1_id_values_are_monotonic(e2e_env):
    """§6 obs 1: `id` values increase monotonically: 1, 2, 3, ..."""
    client, db_path = e2e_env
    ids = []
    for i in range(3):
        r = client.post("/todos", json={"title": f"task {i}"})
        assert r.status_code == 201
        ids.append(r.json()["id"])

    assert ids == [1, 2, 3], f"expected [1, 2, 3], got {ids}"
    assert _ids_in_db(db_path) == [1, 2, 3]


# Observation 2 — created_at distinct across seconds
def test_observation_2_created_at_distinct_across_seconds(e2e_env):
    """§6 obs 2: POSTs >1s apart produce distinct `created_at` values."""
    client, _ = e2e_env
    r1 = client.post("/todos", json={"title": "first"})
    t1 = r1.json()["created_at"]

    time.sleep(1.1)

    r2 = client.post("/todos", json={"title": "second"})
    t2 = r2.json()["created_at"]

    assert t1 != t2, "timestamps should differ across a >1s gap"

    parsed1 = datetime.fromisoformat(t1)
    parsed2 = datetime.fromisoformat(t2)
    gap = parsed2 - parsed1
    assert gap >= timedelta(seconds=1), (
        f"timestamps differ by only {gap}, expected >= 1s"
    )


# Observation 3 — 422 has no id, no row created
def test_observation_3_422_response_has_no_id(e2e_env):
    """§6 obs 3: A 422 response contains no `id` field and creates no row."""
    client, db_path = e2e_env
    r = client.post("/todos", json={"title": ""})

    assert r.status_code == 422
    body = r.json()
    assert "id" not in body, f"422 body must not contain 'id': {body}"
    assert _ids_in_db(db_path) == []
    assert _titles_in_db(db_path) == []


# Observation 4 — response time (informational)
def test_observation_4_response_time_informational(e2e_env):
    """§6 obs 4: Response time for a valid POST is under 200ms (informational).

    This is explicitly informational in §6 ("no AC constrains it"). The
    test asserts the POST succeeds and prints the observed time; it does
    not hard-fail on slowness because CI clocks vary widely and no AC
    requires a specific latency.
    """
    client, _ = e2e_env
    # Warm up: first call may pay import/route-binding overhead
    client.post("/todos", json={"title": "warmup"})

    start = time.perf_counter()
    r = client.post("/todos", json={"title": "timed"})
    elapsed_ms = (time.perf_counter() - start) * 1000

    assert r.status_code == 201
    print(f"\n[obs-4] valid POST response time: {elapsed_ms:.1f}ms "
          f"(informational; §6 threshold: <200ms)")
