-- Execute no SQL Editor do seu projeto Supabase.
create table if not exists public.study_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{"completed":{},"notes":{},"sessions":[],"exams":[],"goal":60}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint valid_study_data check (jsonb_typeof(data) = 'object')
);
alter table public.study_state enable row level security;
revoke all on public.study_state from anon;
grant select, insert, update, delete on public.study_state to authenticated;
drop policy if exists "Read own progress" on public.study_state;
create policy "Read own progress" on public.study_state for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own progress" on public.study_state;
create policy "Insert own progress" on public.study_state for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own progress" on public.study_state;
create policy "Update own progress" on public.study_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Delete own progress" on public.study_state;
create policy "Delete own progress" on public.study_state for delete to authenticated using ((select auth.uid()) = user_id);
