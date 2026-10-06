-- Overdriveauto database setup for Supabase.
-- Run once: Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to run again. Before running, create your ops login under Authentication -> Users,
-- and change the email near the bottom if your login uses a different one.

-- 1. Tables. Each record is stored as JSON in "data".
create table if not exists public.orders (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.requests (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.sellers (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Small settings documents: 'stock' (public), 'costs' and 'settings' (owner only).
create table if not exists public.kv (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
-- Accounts allowed into the operations site.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- 2. Is the signed-in account the owner?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Security rules. Customers can only add new orders, requests and sign-ups;
--    they can never read them. Only the owner reads and changes anything.
alter table public.orders   enable row level security;
alter table public.requests enable row level security;
alter table public.sellers  enable row level security;
alter table public.kv       enable row level security;
alter table public.admins   enable row level security;

drop policy if exists "Customers can place orders" on public.orders;
drop policy if exists "Owner manages orders" on public.orders;
drop policy if exists "Customers can request parts" on public.requests;
drop policy if exists "Owner manages requests" on public.requests;
drop policy if exists "Shops can sign up" on public.sellers;
drop policy if exists "Owner manages sellers" on public.sellers;
drop policy if exists "Anyone can read stock" on public.kv;
drop policy if exists "Owner manages settings" on public.kv;
drop policy if exists "Owner can see own admin row" on public.admins;

create policy "Customers can place orders" on public.orders
  for insert to anon, authenticated
  with check (
    data->>'status' = 'new'
    and coalesce(data->>'example', 'false') = 'false'
    and coalesce((data->>'paid')::numeric, 0) = 0
    and jsonb_typeof(data->'items') = 'array'
    and jsonb_array_length(data->'items') between 1 and 50
    and pg_column_size(data) < 32000
  );
create policy "Owner manages orders" on public.orders
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Customers can request parts" on public.requests
  for insert to anon, authenticated
  with check (
    data->>'status' = 'new'
    and coalesce(data->>'example', 'false') = 'false'
    and pg_column_size(data) < 16000
  );
create policy "Owner manages requests" on public.requests
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Shops can sign up" on public.sellers
  for insert to anon, authenticated
  with check (
    data->>'status' = 'new'
    and coalesce(data->>'example', 'false') = 'false'
    and pg_column_size(data) < 8000
  );
create policy "Owner manages sellers" on public.sellers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can read stock" on public.kv
  for select to anon, authenticated
  using (id = 'stock');
create policy "Owner manages settings" on public.kv
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Owner can see own admin row" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant insert on public.orders, public.requests, public.sellers to anon;
grant select, insert, update, delete on public.orders, public.requests, public.sellers, public.kv to authenticated;
grant select on public.kv to anon;
grant select on public.admins to authenticated;

-- 4. Live updates on the operations site.
do $$
declare t text;
begin
  foreach t in array array['orders', 'requests', 'sellers', 'kv'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object or undefined_object then null;
    end;
  end loop;
end $$;

-- 5. Make your login the owner. Change the email if your ops login uses another one.
insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('orgkiza@gmail.com')
on conflict do nothing;

-- This should show your email. If it shows nothing, create the login first, then run this file again.
select u.email as owner_login from public.admins a join auth.users u on u.id = a.user_id;
