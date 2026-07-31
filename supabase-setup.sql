-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run

create table if not exists app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security must be ON for any public-facing table.
alter table app_state enable row level security;

-- This app has its own teacher/student login (not Supabase Auth), so every
-- request uses the same public "anon" key. This policy allows that anon key
-- to read and write the app_state table — equivalent to how the app worked
-- before (a shared register everyone with the link could read/write).
-- Fine for a classroom tool with no sensitive personal data. If you later
-- want real per-user access control, migrate to Supabase Auth + per-row RLS.
create policy "anon read app_state"
  on app_state for select
  to anon
  using (true);

create policy "anon write app_state"
  on app_state for insert
  to anon
  with check (true);

create policy "anon update app_state"
  on app_state for update
  to anon
  using (true)
  with check (true);

-- Turn on Realtime so changes push live to every open device.
alter publication supabase_realtime add table app_state;
