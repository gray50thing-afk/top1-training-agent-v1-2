-- Phase 2 migration. Run this once in Supabase SQL Editor after Phase 1 schema.sql.
alter table public.training_sessions add column if not exists difficulty text;
alter table public.training_sessions add column if not exists industry text;
alter table public.training_sessions add column if not exists initial_score integer check (initial_score is null or (initial_score >= 0 and initial_score <= 100));
alter table public.training_sessions add column if not exists revised_score integer check (revised_score is null or (revised_score >= 0 and revised_score <= 100));
alter table public.training_sessions add column if not exists score_delta integer;
alter table public.training_sessions add column if not exists revision_answer text;
alter table public.training_sessions add column if not exists strengths jsonb default '[]'::jsonb;
alter table public.training_sessions add column if not exists missing_evidence jsonb default '[]'::jsonb;
alter table public.training_sessions add column if not exists weakness_tags jsonb default '[]'::jsonb;
alter table public.training_sessions add column if not exists strength_tags jsonb default '[]'::jsonb;
alter table public.training_sessions add column if not exists rubric jsonb default '{}'::jsonb;
alter table public.training_sessions add column if not exists ai_problem jsonb default '{}'::jsonb;
