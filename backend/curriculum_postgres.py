import uuid
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional

from asyncpg import UniqueViolationError
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from postgres import get_postgres_pool


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


class ProposalDecision(BaseModel):
    reason: Optional[str] = None


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


def create_curriculum_postgres_router(get_current_user: Callable) -> APIRouter:
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

    return router
