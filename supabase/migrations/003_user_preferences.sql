-- Preferências globais da conta, compartilhadas entre os concursos.
begin;
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  font_scale integer not null default 100
    check (font_scale between 100 and 200 and font_scale % 10 = 0)
);
alter table public.user_preferences enable row level security;
revoke all on public.user_preferences from public, anon, authenticated;
grant select, insert, update on public.user_preferences to authenticated;
drop policy if exists "Read own preferences" on public.user_preferences;
create policy "Read own preferences" on public.user_preferences
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own preferences" on public.user_preferences;
create policy "Insert own preferences" on public.user_preferences
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own preferences" on public.user_preferences;
create policy "Update own preferences" on public.user_preferences
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
commit;
