-- English Exam Trainer — per-user progress
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is safe to re-run: every statement is guarded.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb       not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: a user can only ever touch their own row. Without this
-- the anon key would let anyone read everyone's progress.
alter table public.progress enable row level security;

drop policy if exists "read own progress"   on public.progress;
drop policy if exists "insert own progress" on public.progress;
drop policy if exists "update own progress" on public.progress;
drop policy if exists "delete own progress" on public.progress;

create policy "read own progress"
  on public.progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "insert own progress"
  on public.progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "update own progress"
  on public.progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete own progress"
  on public.progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at honest even if a client forgets to send it.
create or replace function public.touch_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists progress_updated_at on public.progress;

create trigger progress_updated_at
  before update on public.progress
  for each row
  execute function public.touch_progress_updated_at();
