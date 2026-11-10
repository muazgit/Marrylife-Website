-- ============================================================================
-- MarryLife — Production Schema & Row Level Security (RLS) Hardening Migration
-- ============================================================================

-- Extensions
create extension if not exists "pg_trgm";
create extension if not exists "uuid-ossp";

-- 1. ENUMS (Idempotent)
do $$ begin
  create type public.gender_type as enum ('groom', 'bride');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.biodata_status as enum ('draft', 'pending_approval', 'approved', 'rejected', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.marital_status_type as enum ('never_married', 'divorced', 'widowed', 'separated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_status as enum ('pending', 'accepted', 'rejected', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role as enum ('user', 'moderator', 'admin');
exception when duplicate_object then null; end $$;

-- 2. TABLES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default '',
  phone text unique,
  role public.user_role not null default 'user',
  credits integer not null default 5 check (credits >= 0),
  is_verified boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.biodatas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  biodata_number serial unique,
  gender public.gender_type not null,
  marital_status public.marital_status_type not null,
  birth_year integer not null,
  height_feet integer not null,
  height_inches integer not null,
  weight_kg integer,
  complexion text not null,
  blood_group text,

  -- Religious Practice
  prayer_frequency text not null default '৫ ওয়াক্ত',
  observes_purdah_or_beard boolean not null default false,
  mahram_non_mahram_care boolean not null default true,
  quran_recitation_ability text,
  religious_sect text default 'সুন্নি',

  -- Education & Career
  education_medium text not null,
  highest_degree text not null,
  occupation text not null,
  monthly_income text,

  -- Location
  division text not null,
  district text not null,
  upazila text not null,
  permanent_division text not null,
  permanent_district text not null,
  permanent_upazila text,

  -- Family Background
  father_occupation text,
  mother_occupation text,
  brothers_count integer default 0,
  sisters_count integer default 0,
  financial_status text,

  -- Partner Expectations
  expected_partner_age_min integer,
  expected_partner_age_max integer,
  expected_partner_height_min text,
  expected_partner_district text[],
  expected_partner_qualities text not null,

  -- Moderation & State
  status public.biodata_status not null default 'pending_approval',
  rejection_reason text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.biodata_contacts (
  biodata_id uuid references public.biodatas(id) on delete cascade primary key,
  candidate_name text not null,
  candidate_phone text,
  guardian_name text not null,
  guardian_relation text not null,
  guardian_phone text not null,
  guardian_agreement boolean not null default true,
  email text,
  full_address text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  sender_biodata_id uuid references public.biodatas(id) on delete cascade not null,
  target_biodata_id uuid references public.biodatas(id) on delete cascade not null,
  status public.request_status not null default 'pending',
  guardian_response_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(sender_id, target_biodata_id)
);

create table if not exists public.shortlists (
  user_id uuid references public.profiles(id) on delete cascade not null,
  biodata_id uuid references public.biodatas(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key(user_id, biodata_id)
);

create table if not exists public.moderation_logs (
  id uuid default gen_random_uuid() primary key,
  moderator_id uuid references public.profiles(id) not null,
  biodata_id uuid references public.biodatas(id) not null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_biodatas_gender on public.biodatas (gender);
create index if not exists idx_biodatas_status on public.biodatas (status);
create index if not exists idx_biodatas_marital_status on public.biodatas (marital_status);
create index if not exists idx_biodatas_division_district on public.biodatas (division, district);
create index if not exists idx_biodatas_user on public.biodatas (user_id);
create index if not exists idx_contact_requests_sender on public.contact_requests (sender_id);
create index if not exists idx_contact_requests_target on public.contact_requests (target_biodata_id);

-- 3. HELPER FUNCTION FOR ROLE CHECKS (Prevents recursive RLS queries)
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'moderator')
  );
$$;

-- 4. ENABLE ROW LEVEL SECURITY ON ALL TABLES
alter table public.profiles enable row level security;
alter table public.biodatas enable row level security;
alter table public.biodata_contacts enable row level security;
alter table public.contact_requests enable row level security;
alter table public.shortlists enable row level security;
alter table public.moderation_logs enable row level security;

-- 5. HARDENED RLS POLICIES

-- PROFILES: Strictly private to the profile owner and staff (NO public read!)
drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users can view public profile details" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can view their own profile" on public.profiles;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- BIODATAS: Public can read approved rows; owners and staff can read all own/staff rows
drop policy if exists "Public can view approved biodatas" on public.biodatas;
drop policy if exists "Anyone can read approved and active biodatas" on public.biodatas;
create policy "Public can view approved biodatas"
  on public.biodatas for select
  using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_staff()
  );

drop policy if exists "Users can insert their own biodata" on public.biodatas;
create policy "Users can insert their own biodata"
  on public.biodatas for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own biodata" on public.biodatas;
drop policy if exists "Users can update their own pending/draft biodatas" on public.biodatas;
create policy "Users can update their own biodata"
  on public.biodatas for update
  using (auth.uid() = user_id or public.is_staff())
  with check (auth.uid() = user_id or public.is_staff());

-- Column-level privilege hardening: prevent anonymous and regular authenticated API callers from reading internal columns
revoke select on public.biodatas from anon, authenticated;
grant select (
  id, biodata_number, gender, marital_status, birth_year, height_feet, height_inches,
  weight_kg, complexion, blood_group, prayer_frequency, observes_purdah_or_beard,
  mahram_non_mahram_care, quran_recitation_ability, religious_sect, education_medium,
  highest_degree, occupation, division, district, upazila, permanent_division,
  permanent_district, permanent_upazila, father_occupation, mother_occupation,
  brothers_count, sisters_count, financial_status, expected_partner_age_min,
  expected_partner_age_max, expected_partner_height_min, expected_partner_district,
  expected_partner_qualities, status, approved_at, created_at, updated_at
) on public.biodatas to anon, authenticated;

-- Prevent privilege escalation on profiles (role, credits, is_verified)
create or replace function public.protect_profile_sensitive_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user not in ('postgres', 'service_role') and not public.is_staff() then
    new.role := old.role;
    new.credits := old.credits;
    new.is_verified := old.is_verified;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_sensitive_columns on public.profiles;
create trigger trg_protect_profile_sensitive_columns
  before update on public.profiles
  for each row execute procedure public.protect_profile_sensitive_columns();

-- Prevent self-approval on biodatas
create or replace function public.protect_biodata_moderation_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user not in ('postgres', 'service_role') and not public.is_staff() then
    new.user_id := old.user_id;
    new.biodata_number := old.biodata_number;
    new.approved_at := old.approved_at;
    new.rejection_reason := old.rejection_reason;
    if new.status not in ('draft', 'pending_approval', 'hidden') then
      new.status := 'pending_approval';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_biodata_moderation_columns on public.biodatas;
create trigger trg_protect_biodata_moderation_columns
  before update on public.biodatas
  for each row execute procedure public.protect_biodata_moderation_columns();

-- BIODATA_CONTACTS: Strictly protected guardian & candidate PII
drop policy if exists "Protected contact access" on public.biodata_contacts;
drop policy if exists "Strict Contact Information Access" on public.biodata_contacts;
create policy "Protected contact access"
  on public.biodata_contacts for select
  using (
    exists (
      select 1 from public.biodatas
      where id = biodata_contacts.biodata_id
        and user_id = auth.uid()
    )
    or public.is_staff()
    or exists (
      select 1 from public.contact_requests
      where contact_requests.target_biodata_id = biodata_contacts.biodata_id
        and contact_requests.sender_id = auth.uid()
        and contact_requests.status = 'accepted'
    )
  );

drop policy if exists "Owner can insert contact info" on public.biodata_contacts;
drop policy if exists "Owner can create their contact info" on public.biodata_contacts;
create policy "Owner can insert contact info"
  on public.biodata_contacts for insert
  with check (
    exists (
      select 1 from public.biodatas
      where id = biodata_contacts.biodata_id
        and user_id = auth.uid()
    )
  );

drop policy if exists "Owner can update contact info" on public.biodata_contacts;
create policy "Owner can update contact info"
  on public.biodata_contacts for update
  using (
    exists (
      select 1 from public.biodatas
      where id = biodata_contacts.biodata_id
        and user_id = auth.uid()
    )
  );

-- CONTACT_REQUESTS: Visible only to sender, target biodata owner, or staff
drop policy if exists "Users can view their incoming and outgoing requests" on public.contact_requests;
drop policy if exists "Users can view own contact requests" on public.contact_requests;
create policy "Users can view their incoming and outgoing requests"
  on public.contact_requests for select
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.biodatas
      where id = contact_requests.target_biodata_id
        and user_id = auth.uid()
    )
    or public.is_staff()
  );

drop policy if exists "Users can send contact requests" on public.contact_requests;
drop policy if exists "Authenticated users can send contact requests" on public.contact_requests;
create policy "Users can send contact requests"
  on public.contact_requests for insert
  with check (sender_id = auth.uid());

drop policy if exists "Target biodata owner can respond to request" on public.contact_requests;
create policy "Target biodata owner can respond to request"
  on public.contact_requests for update
  using (
    exists (
      select 1 from public.biodatas
      where id = contact_requests.target_biodata_id
        and user_id = auth.uid()
    )
    or public.is_staff()
  );

-- SHORTLISTS: Strictly private to the user
drop policy if exists "Users manage their own shortlists" on public.shortlists;
drop policy if exists "Users manage own shortlists" on public.shortlists;
create policy "Users manage their own shortlists"
  on public.shortlists for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- MODERATION_LOGS: Staff only
drop policy if exists "Staff can view and insert moderation logs" on public.moderation_logs;
create policy "Staff can view and insert moderation logs"
  on public.moderation_logs for all
  using (public.is_staff())
  with check (public.is_staff());
