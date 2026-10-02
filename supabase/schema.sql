create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  context text, role text, objective text, phenomenon text,
  problem_statement text, decision text, evidence text, action text,
  result text, learning text, pattern_candidate text,
  principle_candidate text, boundary text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  training_type text not null default 'marketing' check (training_type in ('business','marketing','geo')),
  question text, answer text, problem_statement text, cause_candidates text,
  cause_hypothesis text, falsification text, validation_plan text,
  solution_hypothesis text, insight text,
  score integer check (score is null or (score >= 0 and score <= 100)),
  feedback text,
  critical_errors jsonb default '[]'::jsonb,
  next_questions jsonb default '[]'::jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.training_sessions enable row level security;

drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles for select using ((select auth.uid()) = id);
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update using ((select auth.uid()) = id);

drop policy if exists "experiences own all" on public.experiences;
create policy "experiences own all" on public.experiences for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "training own all" on public.training_sessions;
create policy "training own all" on public.training_sessions for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id,email,name)
  values (new.id,new.email,new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
