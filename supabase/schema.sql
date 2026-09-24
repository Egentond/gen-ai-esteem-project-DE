-- Loopedy: brand applications table.
-- Run once in the Supabase dashboard → SQL Editor.

create table if not exists public.applications (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  brand_name      text not null,
  website         text not null,
  contact_name    text not null,
  email           text not null,
  role            text,
  category        text not null,
  monthly_orders  text,
  audience        text not null,
  formats         text[] not null default '{}',
  dream_partner   text,
  -- for your own tracking while hand-matching
  status          text not null default 'new',  -- new | reviewing | matched | declined
  notes           text
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_category_idx on public.applications (category);

-- Lock the table down. The site writes with the service role key (server-side only),
-- which bypasses RLS, so no public policies are needed.
alter table public.applications enable row level security;
