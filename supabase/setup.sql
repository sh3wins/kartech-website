-- =====================================================================
--  KARTECH — Supabase setup
--  Paste ALL of this into Supabase → SQL Editor → New query → Run.
--  Safe to run again if something goes wrong.
-- =====================================================================


-- ---------- 1. ADMINS (people allowed to see and manage orders) ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;


-- ---------- 2. ORDERS ----------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_no          text unique not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  status            text not null default 'received'
                    check (status in ('received','confirmed','workshop','ready','delivered','cancelled')),
  status_note       text,                 -- optional message the customer sees on the tracking page
  customer_name     text not null,
  phone             text not null,
  phone_digits      text not null,
  email             text,
  fulfilment        text not null,        -- 'Delivery' / 'Collect from Mtindwa' / 'Collect from Utawala'
  delivery_location text,
  notes             text,
  items             jsonb not null,       -- [{id, name, finish, qty, price}]
  subtotal          numeric not null default 0,
  unpriced_items    int not null default 0
);
alter table public.orders enable row level security;


-- ---------- 3. CUSTOM REQUESTS ----------
create table if not exists public.custom_requests (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  status      text not null default 'new'
              check (status in ('new','contacted','quoted','in_progress','closed')),
  admin_notes text,
  need        text not null,
  space       text,
  name        text not null,
  phone       text,
  email       text,
  files       text[] not null default '{}'
);
alter table public.custom_requests enable row level security;


-- ---------- 4. KEEP updated_at CURRENT ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists requests_touch on public.custom_requests;
create trigger requests_touch before update on public.custom_requests
  for each row execute function public.touch_updated_at();


-- ---------- 5. WHO CAN SEE WHAT ----------
-- The public website can NOT read these tables directly.
-- Customers only ever go through the three functions below.
-- Only admins can read and update everything.
drop policy if exists "admins read orders"     on public.orders;
drop policy if exists "admins update orders"   on public.orders;
drop policy if exists "admins read requests"   on public.custom_requests;
drop policy if exists "admins update requests" on public.custom_requests;
drop policy if exists "see own admin row"      on public.admins;

create policy "admins read orders"     on public.orders          for select using (public.is_admin());
create policy "admins update orders"   on public.orders          for update using (public.is_admin()) with check (public.is_admin());
create policy "admins read requests"   on public.custom_requests for select using (public.is_admin());
create policy "admins update requests" on public.custom_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "see own admin row"      on public.admins          for select using (user_id = auth.uid());


-- ---------- 6. PLACE AN ORDER (called by the website) ----------
create or replace function public.place_order(p jsonb)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_no     text;
  v_digits text := regexp_replace(coalesce(p->>'phone', ''), '\D', '', 'g');
  v_items  jsonb := p->'items';
begin
  if length(trim(coalesce(p->>'name', ''))) = 0 then raise exception 'Name is required'; end if;
  if length(v_digits) < 9 then raise exception 'Phone is required'; end if;
  if jsonb_typeof(v_items) is distinct from 'array'
     or jsonb_array_length(v_items) = 0
     or jsonb_array_length(v_items) > 50 then
    raise exception 'Cart is empty';
  end if;

  loop
    v_no := 'KT-' || to_char(now() at time zone 'Africa/Nairobi', 'YYMMDD') || '-'
            || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    exit when not exists (select 1 from public.orders where order_no = v_no);
  end loop;

  insert into public.orders (order_no, customer_name, phone, phone_digits, email, fulfilment,
                             delivery_location, notes, items, subtotal, unpriced_items)
  values (
    v_no,
    left(trim(p->>'name'), 120),
    left(trim(p->>'phone'), 40),
    v_digits,
    nullif(left(trim(coalesce(p->>'email', '')), 160), ''),
    left(coalesce(nullif(p->>'fulfilment', ''), 'Delivery'), 60),
    nullif(left(trim(coalesce(p->>'location', '')), 300), ''),
    nullif(left(trim(coalesce(p->>'notes', '')), 2000), ''),
    v_items,
    greatest(coalesce((p->>'subtotal')::numeric, 0), 0),
    greatest(coalesce((p->>'unpriced')::int, 0), 0)
  );
  return v_no;
end $$;


-- ---------- 7. TRACK AN ORDER (needs the order number AND the phone number) ----------
create or replace function public.track_order(p_order_no text, p_phone text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
           'order_no',    order_no,
           'created_at',  created_at,
           'updated_at',  updated_at,
           'status',      status,
           'status_note', status_note,
           'fulfilment',  fulfilment,
           'items',       items)
  from public.orders
  where order_no = upper(trim(p_order_no))
    and length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) >= 9
    and right(phone_digits, 9) = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 9)
  limit 1;
$$;


-- ---------- 8. SEND A CUSTOM REQUEST (called by the website) ----------
create or replace function public.submit_custom_request(p jsonb)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_ref   text;
  v_files text[] := '{}';
  v_phone text := trim(coalesce(p->>'phone', ''));
  v_email text := trim(coalesce(p->>'email', ''));
begin
  if length(trim(coalesce(p->>'need', ''))) < 5 then raise exception 'Description is required'; end if;
  if length(trim(coalesce(p->>'name', ''))) = 0 then raise exception 'Name is required'; end if;
  if length(regexp_replace(v_phone, '\D', '', 'g')) < 9 and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Phone or email is required';
  end if;

  if jsonb_typeof(p->'files') = 'array' then
    select coalesce(array_agg(f), '{}') into v_files
    from (select jsonb_array_elements_text(p->'files') as f limit 10) x
    where f like 'requests/%';
  end if;

  loop
    v_ref := 'CR-' || to_char(now() at time zone 'Africa/Nairobi', 'YYMMDD') || '-'
             || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    exit when not exists (select 1 from public.custom_requests where ref = v_ref);
  end loop;

  insert into public.custom_requests (ref, need, space, name, phone, email, files)
  values (
    v_ref,
    left(trim(p->>'need'), 4000),
    left(coalesce(p->>'space', ''), 60),
    left(trim(p->>'name'), 120),
    nullif(left(v_phone, 40), ''),
    nullif(left(v_email, 160), ''),
    v_files
  );
  return v_ref;
end $$;


-- ---------- 9. LET THE WEBSITE CALL THE FUNCTIONS ----------
revoke all on function public.place_order(jsonb)             from public;
revoke all on function public.track_order(text, text)        from public;
revoke all on function public.submit_custom_request(jsonb)   from public;
grant execute on function public.place_order(jsonb)           to anon, authenticated;
grant execute on function public.track_order(text, text)      to anon, authenticated;
grant execute on function public.submit_custom_request(jsonb) to anon, authenticated;
grant execute on function public.is_admin()                   to anon, authenticated;


-- ---------- 10. PHOTO STORAGE FOR CUSTOM REQUESTS (private) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('request-files', 'request-files', false, 10485760,
        array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "website can upload request files" on storage.objects;
drop policy if exists "admins can view request files"    on storage.objects;

-- Anyone can UPLOAD into the requests/ folder, but nobody except admins can look at the files.
create policy "website can upload request files" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'request-files' and (storage.foldername(name))[1] = 'requests');

create policy "admins can view request files" on storage.objects
  for select to authenticated
  using (bucket_id = 'request-files' and public.is_admin());


-- =====================================================================
--  LAST STEP (do this after you create your admin login in
--  Authentication → Users → Add user). Change the email, then run:
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'your-email@example.com'
--  on conflict do nothing;
-- =====================================================================
