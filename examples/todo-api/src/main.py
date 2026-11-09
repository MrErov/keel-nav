"""FastAPI app for todo-api.

Phase 2 version used a stub `get_conn` that returned an in-memory sqlite
connection. Phase 3 replaces that stub with `src.db.get_conn`, which
returns a real file-backed connection. The business logic in `todos.py`
is not modified by this change.
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from src.db import get_conn
from src.todos import create_todo

app = FastAPI()


class TodoIn(BaseModel):
    title: str


@app.post("/todos")
def post_todo(payload: TodoIn):
    conn = get_conn()
    try:
        result = create_todo(payload.title, conn)
    finally:
        conn.close()
    if "error" in result:
        return JSONResponse(status_code=422, content=result)
    return JSONResponse(status_code=201, content=result)
