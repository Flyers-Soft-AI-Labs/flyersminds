# Curriculum Automation With PostgreSQL

## Step-by-step flow

1. Keep MongoDB for users, passwords, sessions, progress, and enrollment.
2. Add PostgreSQL for curriculum source-of-truth data.
3. Run `migrations/001_curriculum.sql` in your Postgres database.
4. Add `POSTGRES_URL` or `DATABASE_URL` to `backend/.env`.
5. Start the FastAPI backend.
6. Admin creates or bootstraps a course in Postgres.
7. Backend sends the current published curriculum plus an admin instruction to AI.
8. AI returns curriculum JSON with a `days` array.
9. Backend stores that JSON in `curriculum_proposals` with status `pending`.
10. Admin reviews the pending proposal.
11. If admin approves, backend creates a new published curriculum version and archives the old one.
12. User portal reads only the latest `published` version.

## Environment variable

Add one of these to `backend/.env`:

```env
POSTGRES_URL=postgresql://postgres:your_password@localhost:5432/flyers_curriculum
```

or:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/flyers_curriculum
```

## Useful commands

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Run the migration:

```bash
psql "postgresql://postgres:your_password@localhost:5432/flyers_curriculum" -f migrations/001_curriculum.sql
```

Start backend:

```bash
uvicorn server:app --reload
```

Check Postgres connection:

```bash
GET /api/pg-curriculum/status
```

## API shape

Public/intern reads:

```txt
GET /api/pg-curriculum/published?course_slug=aiml
GET /api/pg-curriculum/days/1?course_slug=aiml
```

Admin writes:

```txt
POST /api/admin/pg-curriculum/bootstrap-course
POST /api/admin/pg-curriculum/proposals
GET  /api/admin/pg-curriculum/proposals?status=pending
POST /api/admin/pg-curriculum/proposals/{proposal_id}/approve
POST /api/admin/pg-curriculum/proposals/{proposal_id}/reject
```

## First test payload

After logging in as admin, call this endpoint with your bearer token:

```txt
POST /api/admin/pg-curriculum/bootstrap-course
```

Body:

```json
{
  "slug": "aiml",
  "title": "AI / ML Engineering",
  "subtitle": "120-Day Intensive",
  "description": "Python, FastAPI, ML, deep learning, RAG, production AI, and capstone.",
  "publish": true,
  "days": [
    {
      "day": 1,
      "month": 1,
      "week": 1,
      "monthTitle": "Python",
      "weekTitle": "Python Basics",
      "topic": "Python Setup, Variables, Print, Input",
      "overview": "Install Python, set up VS Code, and write the first input/output programs.",
      "content": [],
      "resourceLinks": [
        {
          "title": "Python Setup",
          "url": "https://www.python.org/downloads/"
        }
      ],
      "tasks": [
        {
          "id": "d1_setup",
          "label": "Install Python and VS Code"
        },
        {
          "id": "d1_program",
          "label": "Create a greeting program using input and print"
        }
      ]
    }
  ]
}
```

Then verify it:

```txt
GET /api/pg-curriculum/published?course_slug=aiml
```

## AI prompt starter

Use this later when you connect the AI generation endpoint:

```txt
You are updating the Flyers Minds AI/ML internship curriculum.

Rules:
- Return JSON only.
- Do not include markdown.
- Keep the structure compatible with the existing curriculum day objects.
- Include a top-level "summary" string.
- Include a top-level "days" array.
- Each day must include: day, month, week, monthTitle, weekTitle, topic, overview, content, resourceLinks, tasks.
- Preserve existing day numbers unless the admin explicitly asks to reorder the curriculum.
- Make tasks practical and measurable.
- Do not publish directly. This output will become a pending admin proposal.

Current published curriculum:
{{CURRENT_CURRICULUM_JSON}}

Admin instruction:
{{ADMIN_INSTRUCTION}}
```
