create table errors (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  normalized_code text not null unique,
  name text,
  title text not null,
  description text,
  category text,
  severity text,
  aliases text[] default '{}',
  seo_title text,
  seo_description text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on errors (normalized_code);
create index on errors (category);
create index on errors (status);

create table error_contexts (
  id uuid primary key default gen_random_uuid(),
  error_id uuid not null references errors(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  operating_systems text[] default '{}',
  symptoms text[] default '{}',
  created_at timestamptz not null default now(),
  unique(error_id, slug)
);

create table fixes (
  id uuid primary key default gen_random_uuid(),
  error_id uuid references errors(id) on delete cascade,
  context_id uuid references error_contexts(id) on delete cascade,
  title text not null,
  summary text,
  instructions text,
  risk_level text not null default 'low'
    check (risk_level in ('low', 'medium', 'high', 'critical')),
  difficulty text not null default 'easy'
    check (difficulty in ('easy', 'medium', 'advanced', 'expert')),
  source_type text,
  source_url text,
  evidence_score integer not null default 0,
  confidence_level text not null default 'unknown'
    check (confidence_level in ('verified', 'high', 'medium', 'low', 'unknown')),
  status text not null default 'draft'
    check (status in ('draft', 'review', 'testing', 'verified', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table fix_steps (
  id uuid primary key default gen_random_uuid(),
  fix_id uuid not null references fixes(id) on delete cascade,
  step_number integer not null,
  title text,
  instruction text not null,
  command text,
  expected_result text,
  warning text,
  unique(fix_id, step_number)
);

create table evidence (
  id uuid primary key default gen_random_uuid(),
  fix_id uuid not null references fixes(id) on delete cascade,
  evidence_type text not null,
  source_name text not null,
  source_url text,
  citation text,
  notes text,
  reliability integer default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table fix_tests (
  id uuid primary key default gen_random_uuid(),
  fix_id uuid not null references fixes(id) on delete cascade,
  windows_version text,
  windows_build text,
  architecture text,
  context text,
  result text not null
    check (result in ('success', 'failure', 'partial', 'unknown')),
  notes text,
  tested_at timestamptz not null default now()
);

create table diagnostic_questions (
  id uuid primary key default gen_random_uuid(),
  error_id uuid references errors(id) on delete cascade,
  context_id uuid references error_contexts(id) on delete cascade,
  question text not null,
  question_type text not null default 'single_choice',
  options jsonb,
  order_index integer not null default 0
);

create table diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  error_id uuid references errors(id),
  context_id uuid references error_contexts(id),
  answers jsonb not null default '{}',
  recommended_fix_id uuid references fixes(id),
  status text not null default 'started'
    check (status in ('started', 'in_progress', 'completed', 'resolved', 'failed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table fix_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references diagnostic_sessions(id) on delete cascade,
  fix_id uuid references fixes(id) on delete cascade,
  result text not null
    check (result in ('worked', 'did_not_work', 'partially_worked', 'not_attempted')),
  notes text,
  created_at timestamptz not null default now()
);