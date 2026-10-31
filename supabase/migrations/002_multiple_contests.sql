-- Execute depois de 001_study_state.sql. Preserva as linhas existentes como PMERJ.
begin;
alter table public.study_state add column if not exists contest_id text not null default 'pmerj';
alter table public.study_state drop constraint if exists study_state_pkey;
alter table public.study_state add primary key (user_id, contest_id);
alter table public.study_state drop constraint if exists valid_contest;
alter table public.study_state add constraint valid_contest check (contest_id in ('pmerj', 'gmsg'));
-- As políticas RLS da migração 001 continuam restringindo o acesso ao próprio usuário.
commit;
