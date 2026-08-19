# AI Context Contract v1

## Purpose

Every AI request must identify the current learner and the exact learning context the request came from. This keeps the chatbot aligned to the correct course, module, and topic.

## Request shape

```json
{
  "message": "Explain JWT in simple terms",
  "history": [],
  "ai_context": {
    "context_version": "1.0",
    "user_id": "user_123",
    "course_id": "aiml",
    "module_id": "month-2",
    "topic_id": "day-36",
    "current_activity": "chat",
    "room_id": null,
    "session_id": null
  }
}
```

## Required fields

- `context_version`
- `user_id`
- `course_id`
- `module_id`
- `topic_id`

## Optional fields

- `current_activity`
- `room_id`
- `session_id`

## Field definitions

- `context_version`: Contract version. Start with `"1.0"`.
- `user_id`: Stable authenticated learner ID.
- `course_id`: Stable course ID or slug such as `aiml`.
- `module_id`: Stable module identifier such as `month-1`, `month-2`, or a future database-backed module ID.
- `topic_id`: Stable topic identifier such as `day-21`, `quiz-overview`, or a future database-backed topic ID.
- `current_activity`: The activity being performed when the AI request is made. Current implementation uses `chat`.
- `room_id`: Studio room identifier from Developer 2 when available.
- `session_id`: Session identifier from Developer 2 when available.

## Rules

- IDs must be stable identifiers, not display labels.
- The frontend must send `ai_context` on every AI request.
- `user_id` must match the authenticated user.
- For intern requests, `course_id` must match the learner's active course.
- When `topic_id` follows the `day-N` pattern, the backend resolves it to the published curriculum topic before sending context to the AI model.

## Ownership

- Developer 1 owns the source of truth for `course_id`, `module_id`, and `topic_id`.
- Developer 2 owns the source of truth for `room_id` and `session_id`.
- The AI integration layer owns request validation and prompt context injection.

## Current project mapping

- `user_id`: `user.id` from auth/session
- `course_id`: `user.course`
- `module_id`: derived from the current curriculum month, for example `month-3`
- `topic_id`: derived from route context, for example `day-47`
- `current_activity`: `chat`
- `room_id`: `null` until Studio room support is available
- `session_id`: `null` until Studio session support is available

## Notes for future versions

- If Developer 1 introduces module or topic UUIDs, the contract can keep the same field names and only change the values.
- If Developer 2 makes room/session mandatory, those fields can move from optional to required in `context_version: "1.1"` or later.
