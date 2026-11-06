-- New tables for the fresh TechnoTrade Academy app.
-- Run in Supabase SQL Editor (project omgbvgwcycmaodqxdtbf).
-- RLS: enable on all three. Public read of ACTIVE subscriptions only.
-- device_tokens and notifications: NO public policy (service-role only).

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_paise integer not null,
  duration_days integer not null,
  course_id uuid references public.courses(id),
  course_title text,
  is_advanced boolean not null default false,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  token text not null unique,
  platform text not null default 'android',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all',
  created_by uuid,
  status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.device_tokens enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "public read active subscriptions" on public.subscriptions;
create policy "public read active subscriptions"
  on public.subscriptions for select
  to anon, authenticated
  using (is_active);
-- No policies on device_tokens / notifications: only service-role can
-- read/write them (RLS on + no policy = denied for anon/authenticated).
