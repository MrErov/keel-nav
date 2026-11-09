"""Unit/integration tests for the todos context (Phase 2)."""

import sqlite3
from datetime import datetime

import pytest

from src.db import SCHEMA
from src.todos import create_todo


@pytest.fixture
def conn():
    conn = sqlite3.connect(":memory:")
    conn.executescript(SCHEMA)
    yield conn
    conn.close()


def test_create_valid_todo(conn):
    """T-1 / AC-1: valid title → 201 shape; row in DB."""
    result = create_todo("buy milk", conn)
    assert result["id"] == 1
    assert result["title"] == "buy milk"
    row = conn.execute("SELECT title FROM todos WHERE id = 1").fetchone()
    assert row == ("buy milk",)


def test_create_empty_title_rejected(conn):
    """T-2 / AC-2: empty title → title_required; no row."""
    result = create_todo("", conn)
    assert result["error"] == "title_required"
    assert conn.execute("SELECT COUNT(*) FROM todos").fetchone()[0] == 0


def test_create_whitespace_title_rejected(conn):
    """T-3 / AC-2: whitespace-only title → title_required."""
    result = create_todo("   ", conn)
    assert result["error"] == "title_required"
    assert conn.execute("SELECT COUNT(*) FROM todos").fetchone()[0] == 0


def test_response_id_is_positive_integer(conn):
    """T-4 / AC-3: id is a positive int."""
    result = create_todo("buy milk", conn)
    assert isinstance(result["id"], int)
    assert result["id"] > 0


def test_response_created_at_is_iso8601(conn):
    """T-5 / AC-3: created_at is parseable ISO 8601."""
    result = create_todo("buy milk", conn)
    parsed = datetime.fromisoformat(result["created_at"])
    assert parsed.tzinfo is not None
