-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run)

create extension if not exists "uuid-ossp";

create table if not exists applications (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  country text not null,
  pwd_type text,
  has_pwd_id text,
  has_computer text,
  internet_speed text,
  device_type text,
  occupation text,
  skills text,
  portfolio text,
  resume_name text,
  learning_path text not null,
  why_join text not null,
  career_goals text not null,
  hear_about_us text,
  agree_privacy boolean not null default false,
  submitted_at timestamptz not null default now()
);

-- Pipeline status for the admin dashboard (new -> accepted -> active -> graduate -> hired,
-- or rejected at any point). Safe to re-run this whole file on an existing project —
-- this line just adds the column if it isn't there yet.
alter table applications
  add column if not exists status text not null default 'new';

alter table applications
  drop constraint if exists applications_status_check;

alter table applications
  add constraint applications_status_check
  check (status in ('new', 'accepted', 'active', 'graduate', 'hired', 'rejected'));

alter table applications enable row level security;

-- Anyone (including anonymous applicants on the public form) can submit
drop policy if exists "Public can insert applications" on applications;
create policy "Public can insert applications"
  on applications for insert
  to anon
  with check (true);

-- Only signed-in users (your admin account) can read applications
drop policy if exists "Authenticated can read applications" on applications;
create policy "Authenticated can read applications"
  on applications for select
  to authenticated
  using (true);

-- Only signed-in users (your admin account) can update applications (status pipeline)
drop policy if exists "Authenticated can update applications" on applications;
create policy "Authenticated can update applications"
  on applications for update
  to authenticated
  using (true)
  with check (true);

-- Only signed-in users (your admin account) can delete applications
drop policy if exists "Authenticated can delete applications" on applications;
create policy "Authenticated can delete applications"
  on applications for delete
  to authenticated
  using (true);
