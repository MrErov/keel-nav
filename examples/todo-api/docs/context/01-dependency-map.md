# Dependency map

| Component | Depends on | Notes |
|-----------|------------|-------|
| `src/main.py` | `src.todos`, `src.db` | HTTP wiring only |
| `src/todos.py` | SQLite connection passed by caller | No framework imports |
| `src/db.py` | Python stdlib `sqlite3` | Creates the schema on connect |
| `tests/test_todos.py` | `src.todos`, `src.db.SCHEMA` | In-memory SQLite |
| `tests/test_e2e.py` | `src.main`, `src.db` | FastAPI test client |

There are no external services, message brokers, or network dependencies.
The only runtime dependency outside the standard library is FastAPI.
