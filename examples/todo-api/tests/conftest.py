"""Pytest configuration for examples/todo-api.

Adds the project root to sys.path so `import src.*` works regardless of
whether pytest is invoked as `pytest` or `python -m pytest`. Without this,
plain `pytest tests/` fails with ModuleNotFoundError because the rootdir
is not on sys.path by default.
"""

import sys
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))
