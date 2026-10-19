-- =====================================================================
-- Skema database Undangan Digital
-- Jalankan di Supabase → SQL Editor (sekali saja).
-- =====================================================================


-- ---------------------------------------------------------------------
-- Admin: hanya user yang terdaftar di tabel ini yang bisa akses dashboard.
-- Setelah membuat user di Auth, jalankan:
--   insert into public.admins (user_id) values ('<uuid user>');
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Undangan. Konten fleksibel disimpan di kolom `data` (jsonb),
-- strukturnya mengikuti tipe `InvitationData` di src/lib/types.ts.
-- ---------------------------------------------------------------------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  theme_id text not null,
  event_date timestamptz not null,
  data jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  order_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RSVP + ucapan (digabung seperti referensi: satu form, satu feed).
-- ---------------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  attendance text not null check (attendance in ('hadir', 'tidak', 'ragu')),
  guests smallint not null default 1 check (guests between 0 and 10),
  message text check (char_length(message) <= 1000),
  created_at timestamptz not null default now()
);
create index if not exists rsvps_invitation_idx on public.rsvps (invitation_id, created_at desc);

-- ---------------------------------------------------------------------
-- Pesanan dari halaman katalog.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  theme_id text not null,
  package text not null,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  whatsapp text not null check (whatsapp ~ '^[0-9]{9,15}$'),
  bride_name text not null check (char_length(bride_name) <= 60),
  groom_name text not null check (char_length(groom_name) <= 60),
  event_date date,
  notes text check (char_length(notes) <= 2000),
  status text not null default 'baru'
    check (status in ('baru', 'diproses', 'menunggu_bayar', 'selesai', 'batal')),
  created_at timestamptz not null default now()
);

alter table public.invitations
  drop constraint if exists invitations_order_fk,
  add constraint invitations_order_fk foreign key (order_id) references public.orders (id) on delete set null;

-- updated_at otomatis
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists invitations_touch on public.invitations;
create trigger invitations_touch before update on public.invitations
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admins enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;
alter table public.orders enable row level security;

-- admins: hanya admin yang bisa melihat daftar admin
drop policy if exists "admins_select" on public.admins;
create policy "admins_select" on public.admins for select using (public.is_admin());

-- invitations: publik hanya bisa baca yang sudah publish; admin full access
drop policy if exists "inv_public_read" on public.invitations;
create policy "inv_public_read" on public.invitations
  for select using (is_published or public.is_admin());

drop policy if exists "inv_admin_write" on public.invitations;
create policy "inv_admin_write" on public.invitations
  for all using (public.is_admin()) with check (public.is_admin());

-- rsvps: tamu boleh kirim & baca ucapan pada undangan yang publish
drop policy if exists "rsvp_public_insert" on public.rsvps;
create policy "rsvp_public_insert" on public.rsvps
  for insert with check (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.is_published)
  );

drop policy if exists "rsvp_public_read" on public.rsvps;
create policy "rsvp_public_read" on public.rsvps
  for select using (
    public.is_admin()
    or exists (select 1 from public.invitations i where i.id = invitation_id and i.is_published)
  );

drop policy if exists "rsvp_admin_delete" on public.rsvps;
create policy "rsvp_admin_delete" on public.rsvps
  for delete using (public.is_admin());

-- orders: siapa pun boleh membuat order; hanya admin yang bisa melihat/mengubah
drop policy if exists "order_public_insert" on public.orders;
create policy "order_public_insert" on public.orders
  for insert with check (status = 'baru');

drop policy if exists "order_admin_all" on public.orders;
create policy "order_admin_all" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Storage: bucket publik "media" untuk foto & musik undangan.
-- Siapa pun bisa membaca (file ditampilkan di undangan), hanya admin yang upload/hapus.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- v2: add-on & total di pesanan, testimoni
-- (aman dijalankan ulang di database yang sudah memakai skema v1)
-- =====================================================================
alter table public.orders add column if not exists addons text[] not null default '{}';
alter table public.orders add column if not exists total integer check (total >= 0);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  couple text not null check (char_length(couple) between 2 and 80), -- "Laras & Bima"
  message text check (char_length(message) <= 600),                 -- kutipan (opsional)
  image text,                                                        -- screenshot chat (opsional)
  theme_id text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint testimonial_has_content check (message is not null or image is not null)
);

alter table public.testimonials enable row level security;

drop policy if exists "testi_public_read" on public.testimonials;
create policy "testi_public_read" on public.testimonials
  for select using (is_published or public.is_admin());

drop policy if exists "testi_admin_write" on public.testimonials;
create policy "testi_admin_write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());
