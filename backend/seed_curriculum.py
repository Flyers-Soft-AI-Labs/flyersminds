import asyncio
import json
import os
import subprocess
import sys
import uuid
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import asyncpg
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).parent
EXPORT_SCRIPT = ROOT_DIR / "scripts" / "export_curriculum_to_json.mjs"


def _database_url() -> str:
    load_dotenv(ROOT_DIR / ".env")
    url = os.getenv("DIRECT_URL") or os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("Set DIRECT_URL or DATABASE_URL in backend/.env")

    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.pop("pgbouncer", None)
    query.setdefault("sslmode", "require")
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def _load_curriculum_days() -> list[dict]:
    result = subprocess.run(
        ["node", str(EXPORT_SCRIPT)],
        cwd=ROOT_DIR,
        check=True,
        capture_output=True,
        text=True,
    )
    days = json.loads(result.stdout)
    if not days:
        raise RuntimeError("No curriculum days were exported")
    return days


def _json(value):
    return json.dumps(value if value is not None else [])


async def main() -> None:
    days = _load_curriculum_days()
    database_url = _database_url()

    conn = await asyncpg.connect(database_url)
    try:
        course_id = await conn.fetchval(
            """
            INSERT INTO courses (slug, title, subtitle, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (slug)
            DO UPDATE SET
                title = EXCLUDED.title,
                subtitle = EXCLUDED.subtitle,
                description = EXCLUDED.description,
                updated_at = NOW()
            RETURNING id
            """,
            "aiml",
            "AI / ML Engineering",
            "120-Day Intensive",
            "Python, FastAPI, machine learning, deep learning, RAG, production AI, and capstone.",
        )

        async with conn.transaction():
            await conn.execute(
                "UPDATE curriculum_versions SET status = 'archived' WHERE course_id = $1 AND status = 'published'",
                course_id,
            )
            version_number = await conn.fetchval(
                "SELECT COALESCE(MAX(version_number), 0) + 1 FROM curriculum_versions WHERE course_id = $1",
                course_id,
            )
            version_id = uuid.uuid4()
            await conn.execute(
                """
                INSERT INTO curriculum_versions (id, course_id, version_number, status, created_by)
                VALUES ($1, $2, $3, 'published', 'seed_curriculum.py')
                """,
                version_id,
                course_id,
                version_number,
            )

            for day in days:
                await conn.execute(
                    """
                    INSERT INTO curriculum_days (
                        id, version_id, day_number, month_number, week_number,
                        month_title, week_title, topic, overview, content, hands_on,
                        example, coding_task, assignment, explanation, expected_inputs,
                        expected_outputs, evaluation_checklist, git_task, resource_links, tasks
                    )
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10::jsonb, $11::jsonb,
                        $12, $13, $14, $15, $16,
                        $17, $18::jsonb, $19, $20::jsonb, $21::jsonb
                    )
                    """,
                    uuid.uuid4(),
                    version_id,
                    day.get("day"),
                    day.get("month"),
                    day.get("week"),
                    day.get("monthTitle"),
                    day.get("weekTitle"),
                    day.get("topic"),
                    day.get("overview"),
                    _json(day.get("content")),
                    _json(day.get("handsOn")),
                    day.get("example"),
                    day.get("codingTask"),
                    day.get("assignment"),
                    day.get("explanation"),
                    day.get("expectedInputs"),
                    day.get("expectedOutputs"),
                    _json(day.get("evaluationChecklist")),
                    day.get("gitTask"),
                    _json(day.get("resourceLinks")),
                    _json(day.get("tasks")),
                )

        count = await conn.fetchval(
            "SELECT COUNT(*) FROM curriculum_days WHERE version_id = $1",
            version_id,
        )
        print(f"Seeded course aiml")
        print(f"Published version: {version_number}")
        print(f"Curriculum days inserted: {count}")
    finally:
        await conn.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        print(f"Seed failed: {exc}", file=sys.stderr)
        raise
