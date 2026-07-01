import json
import logging
import uuid
from calendar import monthrange
from datetime import date, datetime, timezone
from typing import Any, Awaitable, Callable, Dict, List, Optional, Tuple

import httpx
from asyncpg import UniqueViolationError
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from postgres import get_postgres_pool

logger = logging.getLogger(__name__)

MONTHLY_CURRICULUM_REVIEW_INSTRUCTION = (
    "Review the current AIML Engineering curriculum for outdated topics, missing practical exercises, "
    "obsolete tools, and new industry-relevant improvements. If no meaningful update is needed, return "
    "the same curriculum and explain that no major update is required. Do not remove existing structure. "
    "Preserve all day numbers."
)


class CurriculumDayInput(BaseModel):
    day: int = Field(..., ge=1)
    month: Optional[int] = Field(None, ge=1)
    week: Optional[int] = Field(None, ge=1)
    monthTitle: Optional[str] = None
    weekTitle: Optional[str] = None
    topic: str
    overview: Optional[str] = None
    content: List[Dict[str, Any]] = Field(default_factory=list)
    handsOn: List[str] = Field(default_factory=list)
    example: Optional[str] = None
    codingTask: Optional[str] = None
    assignment: Optional[str] = None
    explanation: Optional[str] = None
    expectedInputs: Optional[str] = None
    expectedOutputs: Optional[str] = None
    evaluationChecklist: List[str] = Field(default_factory=list)
    gitTask: Optional[str] = None
    resourceLinks: List[Dict[str, Any]] = Field(default_factory=list)
    tasks: List[Dict[str, Any]] = Field(default_factory=list)


class CourseBootstrap(BaseModel):
    slug: str = "aiml"
    title: str = "AI / ML Engineering"
    subtitle: Optional[str] = "120-Day Intensive"
    description: Optional[str] = None
    days: List[CurriculumDayInput] = Field(default_factory=list)
    publish: bool = True


class CurriculumProposalCreate(BaseModel):
    course_slug: str = "aiml"
    prompt: str
    proposal_json: Dict[str, Any]
    summary: Optional[str] = None


class AICurriculumRequest(BaseModel):
    course_slug: str = "aiml"
    instruction: str


class AutomationRunNowRequest(BaseModel):
    course_slug: str = "aiml"


class ProposalDecision(BaseModel):
    reason: Optional[str] = None


CURRICULUM_SYSTEM_PROMPT = (
    "You are updating the Flyers Minds AI/ML internship curriculum. "
    "Return only valid JSON. The output must contain a top-level `days` array. "
    "It may also include optional top-level fields `ai_summary` and `needs_update`. "
    "Each day must preserve the existing frontend-compatible schema: "
    "day, month, week, monthTitle, weekTitle, topic, overview, content, handsOn, "
    "example, codingTask, assignment, explanation, expectedInputs, expectedOutputs, "
    "evaluationChecklist, gitTask, resourceLinks, tasks. "
    "Do not include markdown. Do not include comments."
)


def _require_admin(user: dict) -> None:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


def _day_payload(day: CurriculumDayInput) -> Dict[str, Any]:
    data = day.model_dump()
    return {
        "day_number": data.pop("day"),
        "month_number": data.pop("month"),
        "week_number": data.pop("week"),
        "month_title": data.pop("monthTitle"),
        "week_title": data.pop("weekTitle"),
        "topic": data.pop("topic"),
        "overview": data.pop("overview"),
        "content": data.pop("content"),
        "hands_on": data.pop("handsOn"),
        "example": data.pop("example"),
        "coding_task": data.pop("codingTask"),
        "assignment": data.pop("assignment"),
        "explanation": data.pop("explanation"),
        "expected_inputs": data.pop("expectedInputs"),
        "expected_outputs": data.pop("expectedOutputs"),
        "evaluation_checklist": data.pop("evaluationChecklist"),
        "git_task": data.pop("gitTask"),
        "resource_links": data.pop("resourceLinks"),
        "tasks": data.pop("tasks"),
    }


def _row_to_day(row) -> Dict[str, Any]:
    return {
        "day": row["day_number"],
        "month": row["month_number"],
        "week": row["week_number"],
        "monthTitle": row["month_title"],
        "weekTitle": row["week_title"],
        "topic": row["topic"],
        "overview": row["overview"],
        "content": row["content"] or [],
        "handsOn": row["hands_on"] or [],
        "example": row["example"],
        "codingTask": row["coding_task"],
        "assignment": row["assignment"],
        "explanation": row["explanation"],
        "expectedInputs": row["expected_inputs"],
        "expectedOutputs": row["expected_outputs"],
        "evaluationChecklist": row["evaluation_checklist"] or [],
        "gitTask": row["git_task"],
        "resourceLinks": row["resource_links"] or [],
        "tasks": row["tasks"] or [],
    }


def _normalize_days(days: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalized = []
    for day in days:
        normalized.append(CurriculumDayInput(**day).model_dump())
    return normalized


def _curriculum_changed(current_days: List[Dict[str, Any]], proposed_days: List[Dict[str, Any]]) -> bool:
    return _normalize_days(current_days) != _normalize_days(proposed_days)


def _build_summary(current_days: List[Dict[str, Any]], proposed_days: List[Dict[str, Any]], ai_summary: Optional[str]) -> str:
    changed_topics = []
    current_map = {d["day"]: d["topic"] for d in current_days}
    for day in proposed_days:
        old_topic = current_map.get(day["day"])
        if old_topic and old_topic != day.get("topic"):
            changed_topics.append(f"Day {day['day']}: {old_topic} -> {day['topic']}")

    if ai_summary:
        summary = ai_summary.strip()
    else:
        summary = f"AI reviewed {len(proposed_days)} days."

    if changed_topics:
        topic_summary = "; ".join(changed_topics[:5])
        if len(changed_topics) > 5:
            topic_summary += f" ... and {len(changed_topics) - 5} more"
        summary = f"{summary} {len(changed_topics)} topic(s) changed. {topic_summary}".strip()
    elif not summary.endswith("."):
        summary = f"{summary}."

    return summary


async def _create_version_from_days(
    conn,
    course_id: uuid.UUID,
    days: List[CurriculumDayInput],
    created_by: Optional[str],
    source_proposal_id: Optional[uuid.UUID] = None,
    publish: bool = True,
) -> uuid.UUID:
    version_number = await conn.fetchval(
        "SELECT COALESCE(MAX(version_number), 0) + 1 FROM curriculum_versions WHERE course_id = $1",
        course_id,
    )
    version_id = uuid.uuid4()
    await conn.execute(
        """
        INSERT INTO curriculum_versions
            (id, course_id, version_number, status, source_proposal_id, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        """,
        version_id,
        course_id,
        version_number,
        "published" if publish else "draft",
        source_proposal_id,
        created_by,
    )

    for day in days:
        payload = _day_payload(day)
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
            payload["day_number"],
            payload["month_number"],
            payload["week_number"],
            payload["month_title"],
            payload["week_title"],
            payload["topic"],
            payload["overview"],
            payload["content"],
            payload["hands_on"],
            payload["example"],
            payload["coding_task"],
            payload["assignment"],
            payload["explanation"],
            payload["expected_inputs"],
            payload["expected_outputs"],
            payload["evaluation_checklist"],
            payload["git_task"],
            payload["resource_links"],
            payload["tasks"],
        )

    if publish:
        await conn.execute(
            """
            UPDATE curriculum_versions
            SET status = 'archived'
            WHERE course_id = $1 AND id <> $2 AND status = 'published'
            """,
            course_id,
            version_id,
        )

    return version_id


class CurriculumPostgresService:
    def __init__(
        self,
        pool_getter: Callable,
        openrouter_api_key: str = "",
        curriculum_ai_model: str = "anthropic/claude-sonnet-4-20250514",
        list_course_user_ids: Optional[Callable[[str], Awaitable[List[str]]]] = None,
    ) -> None:
        self.pool_getter = pool_getter
        self.openrouter_api_key = openrouter_api_key
        self.curriculum_ai_model = curriculum_ai_model
        self.list_course_user_ids = list_course_user_ids

    def get_pool(self):
        return self.pool_getter()

    async def get_course(self, conn, course_slug: str):
        course = await conn.fetchrow("SELECT * FROM courses WHERE slug = $1", course_slug)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found. Bootstrap the course first.")
        return course

    async def get_published_curriculum(self, conn, course_slug: str) -> Tuple[Any, Any, List[Dict[str, Any]]]:
        course = await self.get_course(conn, course_slug)
        version = await conn.fetchrow(
            """
            SELECT * FROM curriculum_versions
            WHERE course_id = $1 AND status = 'published'
            ORDER BY version_number DESC
            LIMIT 1
            """,
            course["id"],
        )
        if not version:
            raise HTTPException(status_code=404, detail="No published curriculum found. Bootstrap the course first.")

        rows = await conn.fetch(
            "SELECT * FROM curriculum_days WHERE version_id = $1 ORDER BY day_number",
            version["id"],
        )
        current_days = [_row_to_day(row) for row in rows]
        if not current_days:
            raise HTTPException(status_code=404, detail="Published curriculum has no days")

        return course, version, current_days

    async def _call_ai_for_curriculum(self, current_days: List[Dict[str, Any]], instruction: str) -> Dict[str, Any]:
        if not self.openrouter_api_key:
            raise HTTPException(status_code=500, detail="AI provider not configured. Set OPENROUTER_API_KEY.")

        current_curriculum_json = json.dumps({"days": current_days}, default=str)
        user_message = (
            f"Here is the current curriculum JSON:\n{current_curriculum_json}\n\n"
            f"Instruction:\n{instruction}\n\n"
            "Return the updated curriculum as a single JSON object with a top-level `days` array. "
            "Include ALL days (not just changed ones). "
            "Also include `needs_update` as true or false and an `ai_summary` string explaining the review result. "
            "Return ONLY valid JSON, no markdown fences."
        )

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openrouter_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.curriculum_ai_model,
                        "messages": [
                            {"role": "system", "content": CURRICULUM_SYSTEM_PROMPT},
                            {"role": "user", "content": user_message},
                        ],
                        "max_tokens": 64000,
                        "temperature": 0.3,
                    },
                )
                resp.raise_for_status()
                ai_result = resp.json()
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="AI provider timed out. Try again later.")
        except httpx.HTTPStatusError as exc:
            logger.error("OpenRouter API error: %s %s", exc.response.status_code, exc.response.text[:500])
            if exc.response.status_code == 401:
                raise HTTPException(status_code=502, detail="AI provider authentication failed. Check OPENROUTER_API_KEY.")
            if exc.response.status_code == 429:
                raise HTTPException(status_code=429, detail="AI provider rate limited. Try again later.")
            raise HTTPException(status_code=502, detail=f"AI provider error: {exc.response.status_code}")
        except httpx.HTTPError as exc:
            logger.error("OpenRouter request failed: %s", exc)
            raise HTTPException(status_code=502, detail="Failed to reach AI provider")

        try:
            ai_content = ai_result["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            raise HTTPException(status_code=502, detail="Unexpected AI response format")

        cleaned = ai_content.strip()
        if cleaned.startswith("```"):
            first_newline = cleaned.index("\n")
            cleaned = cleaned[first_newline + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            proposal_data = json.loads(cleaned)
        except json.JSONDecodeError as exc:
            logger.error("AI returned invalid JSON: %s", str(exc)[:200])
            raise HTTPException(status_code=422, detail="AI returned invalid JSON. Try rephrasing your instruction.")

        if not isinstance(proposal_data, dict) or "days" not in proposal_data:
            raise HTTPException(status_code=422, detail="AI response missing top-level 'days' array")

        days_list = proposal_data["days"]
        if not isinstance(days_list, list) or len(days_list) == 0:
            raise HTTPException(status_code=422, detail="AI returned empty or invalid days array")

        for idx, day in enumerate(days_list):
            if not isinstance(day, dict):
                raise HTTPException(status_code=422, detail=f"Day at index {idx} is not an object")
            if "day" not in day or "topic" not in day:
                raise HTTPException(status_code=422, detail=f"Day at index {idx} missing required 'day' or 'topic' field")
            CurriculumDayInput(**day)

        return proposal_data

    async def generate_ai_curriculum_proposal(
        self,
        course_slug: str,
        instruction: str,
        created_by: Optional[str] = None,
        run_type: str = "manual",
    ) -> Dict[str, Any]:
        pool = self.get_pool()
        async with pool.acquire() as conn:
            course, _, current_days = await self.get_published_curriculum(conn, course_slug)

        proposal_data = await self._call_ai_for_curriculum(current_days, instruction)
        proposed_days = proposal_data["days"]
        ai_summary = proposal_data.get("ai_summary")
        changed = _curriculum_changed(current_days, proposed_days)
        needs_update = proposal_data.get("needs_update")
        has_meaningful_change = changed and needs_update is not False
        summary = _build_summary(current_days, proposed_days, ai_summary)

        if run_type != "manual" and not has_meaningful_change:
            return {
                "status": "skipped",
                "message": "No meaningful curriculum update needed this month",
                "summary": summary,
                "ai_summary": ai_summary,
                "proposal_id": None,
                "day_count": len(proposed_days),
            }

        if run_type == "monthly":
            month_start = date.today().replace(day=1)
            async with pool.acquire() as conn:
                existing_proposal = await conn.fetchrow(
                    """
                    SELECT id, summary
                    FROM curriculum_proposals
                    WHERE course_id = $1
                      AND status = 'pending'
                      AND created_by = 'system/monthly-automation'
                      AND created_at >= $2
                    ORDER BY created_at DESC
                    LIMIT 1
                    """,
                    course["id"],
                    month_start,
                )
            if existing_proposal:
                return {
                    "status": "proposal_created",
                    "message": "Monthly curriculum proposal already exists for this month",
                    "proposal_id": str(existing_proposal["id"]),
                    "summary": existing_proposal["summary"] or summary,
                    "ai_summary": ai_summary,
                    "day_count": len(proposed_days),
                }

        proposal_id = uuid.uuid4()
        proposal_created_by = created_by or ("system/monthly-automation" if run_type == "monthly" else None)
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO curriculum_proposals
                    (id, course_id, prompt, proposal_json, summary, status, created_by)
                VALUES ($1, $2, $3, $4::jsonb, $5, 'pending', $6)
                """,
                proposal_id,
                course["id"],
                instruction,
                proposal_data,
                summary,
                proposal_created_by,
            )

        return {
            "status": "proposal_created",
            "message": "AI curriculum proposal created and pending review",
            "proposal_id": str(proposal_id),
            "summary": summary,
            "ai_summary": ai_summary,
            "day_count": len(proposed_days),
        }

    async def create_curriculum_update_notifications(self, course_slug: str, course_id: uuid.UUID, course_title: str) -> int:
        if not self.list_course_user_ids:
            return 0

        user_ids = [user_id for user_id in await self.list_course_user_ids(course_slug) if user_id]
        if not user_ids:
            return 0

        title = f"{course_title} curriculum updated"
        message = f"The approved {course_title} curriculum is now live. Review the latest published lessons on your dashboard."
        rows = [
            (
                uuid.uuid4(),
                user_id,
                course_id,
                title,
                message,
            )
            for user_id in user_ids
        ]

        pool = self.get_pool()
        async with pool.acquire() as conn:
            await conn.executemany(
                """
                INSERT INTO curriculum_update_notifications
                    (id, user_id, course_id, title, message, type, is_read, created_at)
                VALUES ($1, $2, $3, $4, $5, 'curriculum_update', FALSE, NOW())
                """,
                rows,
            )
        return len(rows)

    async def list_automation_runs(self, course_slug: Optional[str] = None, limit: int = 24) -> List[Dict[str, Any]]:
        pool = self.get_pool()
        async with pool.acquire() as conn:
            if course_slug:
                rows = await conn.fetch(
                    """
                    SELECT ar.*, c.slug AS course_slug, c.title AS course_title
                    FROM curriculum_automation_runs ar
                    JOIN courses c ON c.id = ar.course_id
                    WHERE c.slug = $1
                    ORDER BY ar.started_at DESC
                    LIMIT $2
                    """,
                    course_slug,
                    limit,
                )
            else:
                rows = await conn.fetch(
                    """
                    SELECT ar.*, c.slug AS course_slug, c.title AS course_title
                    FROM curriculum_automation_runs ar
                    JOIN courses c ON c.id = ar.course_id
                    ORDER BY ar.started_at DESC
                    LIMIT $1
                    """,
                    limit,
                )
        return [dict(row) for row in rows]

    async def run_monthly_review(self, course_slug: str) -> Dict[str, Any]:
        pool = self.get_pool()
        now = datetime.now(timezone.utc)
        run_month = date(now.year, now.month, 1)

        async with pool.acquire() as conn:
            async with conn.transaction():
                course = await self.get_course(conn, course_slug)
                run = await conn.fetchrow(
                    """
                    SELECT *
                    FROM curriculum_automation_runs
                    WHERE course_id = $1 AND run_type = 'monthly' AND run_month = $2
                    FOR UPDATE
                    """,
                    course["id"],
                    run_month,
                )

                if run and run["status"] in ("proposal_created", "skipped"):
                    return {
                        "status": run["status"],
                        "message": "Monthly review already completed for this course and month",
                        "proposal_id": str(run["proposal_id"]) if run["proposal_id"] else None,
                        "summary": run["ai_summary"],
                        "run_id": str(run["id"]),
                    }

                if run and run["status"] == "started" and run["finished_at"] is None:
                    started_at = run["started_at"]
                    if started_at and (now - started_at).total_seconds() < 21600:
                        return {
                            "status": "started",
                            "message": "Monthly review already in progress for this course and month",
                            "proposal_id": str(run["proposal_id"]) if run["proposal_id"] else None,
                            "summary": run["ai_summary"],
                            "run_id": str(run["id"]),
                        }

                if run:
                    run_id = run["id"]
                    await conn.execute(
                        """
                        UPDATE curriculum_automation_runs
                        SET status = 'started', started_at = $2, finished_at = NULL,
                            proposal_id = NULL, error_message = NULL, ai_summary = NULL
                        WHERE id = $1
                        """,
                        run_id,
                        now,
                    )
                else:
                    run_id = uuid.uuid4()
                    await conn.execute(
                        """
                        INSERT INTO curriculum_automation_runs
                            (id, course_id, run_type, run_month, status, started_at)
                        VALUES ($1, $2, 'monthly', $3, 'started', $4)
                        """,
                        run_id,
                        course["id"],
                        run_month,
                        now,
                    )

        try:
            result = await self.generate_ai_curriculum_proposal(
                course_slug,
                MONTHLY_CURRICULUM_REVIEW_INSTRUCTION,
                created_by="system/monthly-automation",
                run_type="monthly",
            )
            async with pool.acquire() as conn:
                await conn.execute(
                    """
                    UPDATE curriculum_automation_runs
                    SET status = $2, finished_at = $3, proposal_id = $4, ai_summary = $5
                    WHERE id = $1
                    """,
                    run_id,
                    result["status"],
                    datetime.now(timezone.utc),
                    uuid.UUID(result["proposal_id"]) if result.get("proposal_id") else None,
                    result.get("summary"),
                )
            result["run_id"] = str(run_id)
            return result
        except Exception as exc:
            error_message = str(exc)
            async with pool.acquire() as conn:
                await conn.execute(
                    """
                    UPDATE curriculum_automation_runs
                    SET status = 'failed', finished_at = $2, error_message = $3
                    WHERE id = $1
                    """,
                    run_id,
                    datetime.now(timezone.utc),
                    error_message[:2000],
                )
            raise


def create_curriculum_postgres_service(
    openrouter_api_key: str = "",
    curriculum_ai_model: str = "anthropic/claude-sonnet-4-20250514",
    list_course_user_ids: Optional[Callable[[str], Awaitable[List[str]]]] = None,
) -> CurriculumPostgresService:
    return CurriculumPostgresService(
        get_postgres_pool,
        openrouter_api_key=openrouter_api_key,
        curriculum_ai_model=curriculum_ai_model,
        list_course_user_ids=list_course_user_ids,
    )


def should_run_curriculum_automation(now: datetime, scheduled_day: int, scheduled_hour: int) -> bool:
    if scheduled_day < 1:
        scheduled_day = 1
    if scheduled_hour < 0:
        scheduled_hour = 0
    if scheduled_hour > 23:
        scheduled_hour = 23

    run_day = min(scheduled_day, monthrange(now.year, now.month)[1])
    scheduled_at = now.replace(day=run_day, hour=scheduled_hour, minute=0, second=0, microsecond=0)
    return now >= scheduled_at


def create_curriculum_postgres_router(
    get_current_user: Callable,
    service: CurriculumPostgresService,
) -> APIRouter:
    router = APIRouter()

    @router.get("/pg-curriculum/status")
    async def postgres_curriculum_status():
        try:
            pool = service.get_pool()
            async with pool.acquire() as conn:
                value = await conn.fetchval("SELECT 1")
            return {"configured": True, "connected": value == 1}
        except Exception as exc:
            return {"configured": False, "connected": False, "detail": str(exc)}

    @router.get("/pg-curriculum/published")
    async def get_published_curriculum(course_slug: str = "aiml", user=Depends(get_current_user)):
        pool = service.get_pool()
        async with pool.acquire() as conn:
            course = await conn.fetchrow("SELECT * FROM courses WHERE slug = $1", course_slug)
            if not course:
                raise HTTPException(status_code=404, detail="Course not found")
            version = await conn.fetchrow(
                """
                SELECT * FROM curriculum_versions
                WHERE course_id = $1 AND status = 'published'
                ORDER BY version_number DESC
                LIMIT 1
                """,
                course["id"],
            )
            if not version:
                return {"course": dict(course), "version": None, "days": []}
            rows = await conn.fetch(
                "SELECT * FROM curriculum_days WHERE version_id = $1 ORDER BY day_number",
                version["id"],
            )
            return {"course": dict(course), "version": dict(version), "days": [_row_to_day(row) for row in rows]}

    @router.get("/pg-curriculum/days/{day_number}")
    async def get_published_curriculum_day(day_number: int, course_slug: str = "aiml", user=Depends(get_current_user)):
        pool = service.get_pool()
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT d.*
                FROM curriculum_days d
                JOIN curriculum_versions v ON v.id = d.version_id
                JOIN courses c ON c.id = v.course_id
                WHERE c.slug = $1 AND v.status = 'published' AND d.day_number = $2
                ORDER BY v.version_number DESC
                LIMIT 1
                """,
                course_slug,
                day_number,
            )
            if not row:
                raise HTTPException(status_code=404, detail="Curriculum day not found")
            return _row_to_day(row)

    @router.post("/admin/pg-curriculum/bootstrap-course")
    async def bootstrap_course(data: CourseBootstrap, user=Depends(get_current_user)):
        _require_admin(user)
        pool = service.get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                course_id = uuid.uuid4()
                try:
                    await conn.execute(
                        """
                        INSERT INTO courses (id, slug, title, subtitle, description)
                        VALUES ($1, $2, $3, $4, $5)
                        """,
                        course_id,
                        data.slug,
                        data.title,
                        data.subtitle,
                        data.description,
                    )
                except UniqueViolationError:
                    course_id = await conn.fetchval("SELECT id FROM courses WHERE slug = $1", data.slug)
                    await conn.execute(
                        """
                        UPDATE courses
                        SET title = $2, subtitle = $3, description = $4, updated_at = NOW()
                        WHERE slug = $1
                        """,
                        data.slug,
                        data.title,
                        data.subtitle,
                        data.description,
                    )
                version_id = None
                if data.days:
                    version_id = await _create_version_from_days(conn, course_id, data.days, user.get("id"), publish=data.publish)
        return {"message": "Course saved", "course_id": str(course_id), "version_id": str(version_id) if version_id else None}

    @router.post("/admin/pg-curriculum/proposals")
    async def create_proposal(data: CurriculumProposalCreate, user=Depends(get_current_user)):
        _require_admin(user)
        pool = service.get_pool()
        async with pool.acquire() as conn:
            course_id = await conn.fetchval("SELECT id FROM courses WHERE slug = $1", data.course_slug)
            if not course_id:
                raise HTTPException(status_code=404, detail="Course not found. Bootstrap the course first.")
            proposal_id = uuid.uuid4()
            await conn.execute(
                """
                INSERT INTO curriculum_proposals
                    (id, course_id, prompt, proposal_json, summary, status, created_by)
                VALUES ($1, $2, $3, $4::jsonb, $5, 'pending', $6)
                """,
                proposal_id,
                course_id,
                data.prompt,
                data.proposal_json,
                data.summary,
                user.get("id"),
            )
        return {"message": "Proposal saved for admin review", "proposal_id": str(proposal_id)}

    @router.get("/admin/pg-curriculum/proposals")
    async def list_proposals(status: str = "pending", user=Depends(get_current_user)):
        _require_admin(user)
        pool = service.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT p.*, c.slug AS course_slug, c.title AS course_title, ar.run_type AS automation_run_type
                FROM curriculum_proposals p
                JOIN courses c ON c.id = p.course_id
                LEFT JOIN curriculum_automation_runs ar ON ar.proposal_id = p.id
                WHERE p.status = $1
                ORDER BY p.created_at DESC
                """,
                status,
            )
        return [dict(row) for row in rows]

    @router.post("/admin/pg-curriculum/proposals/{proposal_id}/approve")
    async def approve_proposal(proposal_id: uuid.UUID, decision: ProposalDecision = ProposalDecision(), user=Depends(get_current_user)):
        _require_admin(user)
        pool = service.get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                proposal = await conn.fetchrow(
                    """
                    SELECT p.*, c.slug AS course_slug, c.title AS course_title
                    FROM curriculum_proposals p
                    JOIN courses c ON c.id = p.course_id
                    WHERE p.id = $1
                    FOR UPDATE
                    """,
                    proposal_id,
                )
                if not proposal:
                    raise HTTPException(status_code=404, detail="Proposal not found")
                if proposal["status"] != "pending":
                    raise HTTPException(status_code=400, detail="Proposal is not pending")

                raw_days = proposal["proposal_json"].get("days", [])
                if not raw_days:
                    raise HTTPException(status_code=400, detail="Proposal JSON must contain a days array")
                days = [CurriculumDayInput(**day) for day in raw_days]
                version_id = await _create_version_from_days(
                    conn,
                    proposal["course_id"],
                    days,
                    user.get("id"),
                    source_proposal_id=proposal_id,
                    publish=True,
                )
                await conn.execute(
                    """
                    UPDATE curriculum_proposals
                    SET status = 'approved', reviewed_by = $2, reviewed_at = $3, review_reason = $4
                    WHERE id = $1
                    """,
                    proposal_id,
                    user.get("id"),
                    datetime.now(timezone.utc),
                    decision.reason,
                )

        notification_count = 0
        try:
            notification_count = await service.create_curriculum_update_notifications(
                proposal["course_slug"],
                proposal["course_id"],
                proposal["course_title"],
            )
        except Exception:
            logger.exception("Failed to create curriculum update notifications for proposal %s", proposal_id)

        return {
            "message": "Proposal approved and published",
            "version_id": str(version_id),
            "notifications_created": notification_count,
        }

    @router.post("/admin/pg-curriculum/proposals/{proposal_id}/reject")
    async def reject_proposal(proposal_id: uuid.UUID, decision: ProposalDecision, user=Depends(get_current_user)):
        _require_admin(user)
        pool = service.get_pool()
        async with pool.acquire() as conn:
            result = await conn.execute(
                """
                UPDATE curriculum_proposals
                SET status = 'rejected', reviewed_by = $2, reviewed_at = $3, review_reason = $4
                WHERE id = $1 AND status = 'pending'
                """,
                proposal_id,
                user.get("id"),
                datetime.now(timezone.utc),
                decision.reason,
            )
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Pending proposal not found")
        return {"message": "Proposal rejected"}

    @router.post("/admin/pg-curriculum/ai-proposals")
    async def create_ai_proposal(data: AICurriculumRequest, user=Depends(get_current_user)):
        _require_admin(user)
        return await service.generate_ai_curriculum_proposal(
            data.course_slug,
            data.instruction,
            created_by=user.get("id"),
            run_type="manual",
        )

    @router.get("/admin/pg-curriculum/proposals/pending-count")
    async def pending_proposal_count(user=Depends(get_current_user)):
        _require_admin(user)
        try:
            pool = service.get_pool()
        except RuntimeError:
            return {"count": 0}
        async with pool.acquire() as conn:
            count = await conn.fetchval(
                "SELECT COUNT(*) FROM curriculum_proposals WHERE status = 'pending'"
            )
        return {"count": count}

    @router.get("/admin/curriculum/automation-runs")
    async def get_automation_runs(course_slug: str = "aiml", user=Depends(get_current_user)):
        _require_admin(user)
        return await service.list_automation_runs(course_slug=course_slug)

    @router.post("/admin/curriculum/automation/run-now")
    async def run_automation_now(data: AutomationRunNowRequest = AutomationRunNowRequest(), user=Depends(get_current_user)):
        _require_admin(user)
        return await service.run_monthly_review(data.course_slug)

    @router.get("/notifications")
    async def list_notifications(user=Depends(get_current_user)):
        pool = service.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT n.*, c.slug AS course_slug, c.title AS course_title
                FROM curriculum_update_notifications n
                JOIN courses c ON c.id = n.course_id
                WHERE n.user_id = $1
                ORDER BY n.created_at DESC
                LIMIT 50
                """,
                user.get("id"),
            )
        return [dict(row) for row in rows]

    @router.post("/notifications/{notification_id}/read")
    async def mark_notification_read(notification_id: uuid.UUID, user=Depends(get_current_user)):
        pool = service.get_pool()
        async with pool.acquire() as conn:
            result = await conn.execute(
                """
                UPDATE curriculum_update_notifications
                SET is_read = TRUE
                WHERE id = $1 AND user_id = $2
                """,
                notification_id,
                user.get("id"),
            )
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"message": "Notification marked as read"}

    return router
