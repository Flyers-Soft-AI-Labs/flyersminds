CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    source_proposal_id UUID,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, version_number)
);

CREATE TABLE IF NOT EXISTS curriculum_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES curriculum_versions(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    month_number INTEGER,
    week_number INTEGER,
    month_title TEXT,
    week_title TEXT,
    topic TEXT NOT NULL,
    overview TEXT,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    hands_on JSONB NOT NULL DEFAULT '[]'::jsonb,
    example TEXT,
    coding_task TEXT,
    assignment TEXT,
    explanation TEXT,
    expected_inputs TEXT,
    expected_outputs TEXT,
    evaluation_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    git_task TEXT,
    resource_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (version_id, day_number)
);

CREATE TABLE IF NOT EXISTS curriculum_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    proposal_json JSONB NOT NULL,
    summary TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    review_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_versions_course_status
    ON curriculum_versions(course_id, status);

CREATE INDEX IF NOT EXISTS idx_curriculum_days_version_day
    ON curriculum_days(version_id, day_number);

CREATE INDEX IF NOT EXISTS idx_curriculum_proposals_course_status
    ON curriculum_proposals(course_id, status);
