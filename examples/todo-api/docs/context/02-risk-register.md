# Risk register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Validation diverges between unit and HTTP layers | Empty titles could be accepted or return the wrong status | AC-2 names the `422` shape; unit tests cover `create_todo`, e2e covers the HTTP response |
| SQLite path leaks between tests | Tests pollute each other or write to the repo | `test_e2e.py` monkeypatches `src.db.DB_PATH` to `tmp_path` |
| Schema creation on every connection | Slow or surprising side effects | Acceptable for this walkthrough; documented as known tech debt |
| No migration path | Schema changes require manual intervention | Out of scope for one table; future story |
| No authentication | Anyone can create todos | Out of scope by design |
