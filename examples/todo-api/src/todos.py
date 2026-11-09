"""Business logic for the todos context (Phase 2, unchanged in Phase 3)."""

from datetime import datetime, timezone


def create_todo(title: str, conn) -> dict:
    """Create a todo from a title; validate before inserting."""
    clean = title.strip()
    if not clean:
        return {"error": "title_required", "detail": "title must not be empty"}
    created_at = datetime.now(timezone.utc).isoformat()
    cursor = conn.execute(
        "INSERT INTO todos (title, created_at) VALUES (?, ?)",
        (clean, created_at),
    )
    conn.commit()
    return {
        "id": cursor.lastrowid,
        "title": clean,
        "created_at": created_at,
    }
