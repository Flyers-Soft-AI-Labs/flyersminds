CREATE TABLE IF NOT EXISTS curriculum_automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    run_type TEXT NOT NULL DEFAULT 'monthly',
    run_month DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('started', 'skipped', 'proposal_created', 'failed')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    proposal_id UUID REFERENCES curriculum_proposals(id) ON DELETE SET NULL,
    error_message TEXT,
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, run_type, run_month)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_automation_runs_course_month
    ON curriculum_automation_runs(course_id, run_month DESC);

CREATE INDEX IF NOT EXISTS idx_curriculum_automation_runs_proposal_id
    ON curriculum_automation_runs(proposal_id);

CREATE TABLE IF NOT EXISTS curriculum_update_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'curriculum_update',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_update_notifications_user_created
    ON curriculum_update_notifications(user_id, is_read, created_at DESC);
