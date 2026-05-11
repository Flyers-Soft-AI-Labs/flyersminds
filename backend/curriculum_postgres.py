import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional

import httpx
from asyncpg import UniqueViolationError
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from postgres import get_postgres_pool

logger = logging.getLogger(__name__)


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


class ProposalDecision(BaseModel):
    reason: Optional[str] = None


CURRICULUM_SYSTEM_PROMPT = (
    "You are updating the Flyers Minds AI/ML internship curriculum. "
    "Return only valid JSON. The output must contain a top-level `days` array. "
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


def create_curriculum_postgres_router(
    get_current_user: Callable,
    openrouter_api_key: str = "",
    curriculum_ai_model: str = "anthropic/claude-sonnet-4-20250514",
) -> APIRouter:
    router = APIRouter()

    @router.get("/pg-curriculum/status")
    async def postgres_curriculum_status():
        try:
            pool = get_postgres_pool()
            async with pool.acquire() as conn:
                value = await conn.fetchval("SELECT 1")
            return {"configured": True, "connected": value == 1}
        except Exception as exc:
            return {"configured": False, "connected": False, "detail": str(exc)}

    @router.get("/pg-curriculum/published")
    async def get_published_curriculum(course_slug: str = "aiml", user=Depends(get_current_user)):
        pool = get_postgres_pool()
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
        pool = get_postgres_pool()
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
        pool = get_postgres_pool()
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
        pool = get_postgres_pool()
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
        pool = get_postgres_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT p.*, c.slug AS course_slug, c.title AS course_title
                FROM curriculum_proposals p
                JOIN courses c ON c.id = p.course_id
                WHERE p.status = $1
                ORDER BY p.created_at DESC
                """,
                status,
            )
        return [dict(row) for row in rows]

    @router.post("/admin/pg-curriculum/proposals/{proposal_id}/approve")
    async def approve_proposal(proposal_id: uuid.UUID, decision: ProposalDecision = ProposalDecision(), user=Depends(get_current_user)):
        _require_admin(user)
        pool = get_postgres_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                proposal = await conn.fetchrow(
                    "SELECT * FROM curriculum_proposals WHERE id = $1 FOR UPDATE",
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
        return {"message": "Proposal approved and published", "version_id": str(version_id)}

    @router.post("/admin/pg-curriculum/proposals/{proposal_id}/reject")
    async def reject_proposal(proposal_id: uuid.UUID, decision: ProposalDecision, user=Depends(get_current_user)):
        _require_admin(user)
        pool = get_postgres_pool()
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

    # ── AI-powered curriculum proposal generation ──────────────────────

    @router.post("/admin/pg-curriculum/ai-proposals")
    async def create_ai_proposal(data: AICurriculumRequest, user=Depends(get_current_user)):
        _require_admin(user)

        if not openrouter_api_key:
            raise HTTPException(status_code=500, detail="AI provider not configured. Set OPENROUTER_API_KEY.")

        # 1. Fetch published curriculum from Postgres
        try:
            pool = get_postgres_pool()
        except RuntimeError:
            raise HTTPException(status_code=500, detail="PostgreSQL is not configured")

        async with pool.acquire() as conn:
            course = await conn.fetchrow("SELECT * FROM courses WHERE slug = $1", data.course_slug)
            if not course:
                raise HTTPException(status_code=404, detail="Course not found. Bootstrap the course first.")

            version = await conn.fetchrow(
                """
                SELECT * FROM curriculum_versions
                WHERE course_id = $1 AND status = 'published'
                ORDER BY version_number DESC LIMIT 1
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

        # 2. Call AI via OpenRouter
        current_curriculum_json = json.dumps({"days": current_days}, default=str)

        user_message = (
            f"Here is the current curriculum JSON:\n{current_curriculum_json}\n\n"
            f"Admin instruction:\n{data.instruction}\n\n"
            "Return the updated curriculum as a single JSON object with a top-level `days` array. "
            "Include ALL days (not just changed ones). Return ONLY valid JSON, no markdown fences."
        )

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openrouter_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": curriculum_ai_model,
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
            raise HTTPException(status_code=504, detail="AI provider timed out. Try a shorter instruction or try again later.")
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

        # 3. Extract and parse AI response
        try:
            ai_content = ai_result["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            raise HTTPException(status_code=502, detail="Unexpected AI response format")

        # Strip markdown code fences if AI included them
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

        # 4. Validate structure
        if not isinstance(proposal_data, dict) or "days" not in proposal_data:
            raise HTTPException(status_code=422, detail="AI response missing top-level 'days' array")

        days_list = proposal_data["days"]
        if not isinstance(days_list, list) or len(days_list) == 0:
            raise HTTPException(status_code=422, detail="AI returned empty or invalid days array")

        for i, day in enumerate(days_list):
            if not isinstance(day, dict):
                raise HTTPException(status_code=422, detail=f"Day at index {i} is not an object")
            if "day" not in day or "topic" not in day:
                raise HTTPException(status_code=422, detail=f"Day at index {i} missing required 'day' or 'topic' field")

        # 5. Build summary
        changed_topics = []
        current_map = {d["day"]: d["topic"] for d in current_days}
        for day in days_list:
            old_topic = current_map.get(day["day"])
            if old_topic and old_topic != day.get("topic"):
                changed_topics.append(f"Day {day['day']}: {old_topic} -> {day['topic']}")
        summary = f"AI updated {len(days_list)} days. "
        if changed_topics:
            summary += f"{len(changed_topics)} topic(s) changed. "
            summary += "; ".join(changed_topics[:5])
            if len(changed_topics) > 5:
                summary += f" ... and {len(changed_topics) - 5} more"
        else:
            summary += "Content updated (topics preserved)."

        # 6. Save as pending proposal
        async with pool.acquire() as conn:
            proposal_id = uuid.uuid4()
            await conn.execute(
                """
                INSERT INTO curriculum_proposals
                    (id, course_id, prompt, proposal_json, summary, status, created_by)
                VALUES ($1, $2, $3, $4::jsonb, $5, 'pending', $6)
                """,
                proposal_id,
                course["id"],
                data.instruction,
                proposal_data,
                summary,
                user.get("id"),
            )

        return {
            "message": "AI curriculum proposal created and pending review",
            "proposal_id": str(proposal_id),
            "summary": summary,
            "day_count": len(days_list),
        }

    # ── Pending proposals count (for admin badge) ─────────────────────

    @router.get("/admin/pg-curriculum/proposals/pending-count")
    async def pending_proposal_count(user=Depends(get_current_user)):
        _require_admin(user)
        try:
            pool = get_postgres_pool()
        except RuntimeError:
            return {"count": 0}
        async with pool.acquire() as conn:
            count = await conn.fetchval(
                "SELECT COUNT(*) FROM curriculum_proposals WHERE status = 'pending'"
            )
        return {"count": count}

    return router
