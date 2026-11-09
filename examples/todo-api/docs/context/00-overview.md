# Context: `todo-api`

## Purpose

A single-endpoint REST API used as the educational walkthrough for Keel
Nav. It exists to show the shape of the artifacts produced by Phases 0–4,
not to serve as a production service.

## Stack

- Python 3.11+
- FastAPI for the HTTP layer
- SQLite for persistence
- pytest for tests

## Scope

One bounded context (`todos`), one endpoint (`POST /todos`), one table
(`todos`). The only operation is creating a todo item.

## Out of scope

- Authentication and ownership
- Listing, updating, or deleting todos
- Any UI
- Migrations or production database operations
