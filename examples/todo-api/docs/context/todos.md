# Bounded context: `todos`

## Entity

`Todo`

| Field | Type | Rules |
|-------|------|-------|
| `id` | integer | Primary key, autoincrement |
| `title` | string | Non-empty after `strip()` |
| `created_at` | string | UTC time in ISO 8601 |

## Invariants

- A todo title must contain at least one non-whitespace character.
- `created_at` is set by the server, never by the client.
- A rejected create request inserts no row.

## Operations

- `create_todo(title, conn)` — validate, insert, and return the created
  row representation.

## Out of scope

- Listing todos
- Updating or deleting todos
- Assigning ownership
- Pagination or filtering
