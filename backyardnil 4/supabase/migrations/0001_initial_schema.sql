-- =====================================================================
-- BackyardNIL — Initial Schema
-- Athlete Profiles + Rate Cards + Compliance Status
-- =====================================================================

-- ─── ATHLETE PROFILES ────────────────────────────────────────────────
-- One profile per athlete, owned/managed by a parent's auth account.
create table athlete_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  -- Identity
  slug text unique not null,                  -- public URL slug, e.g. "marcus-webb"
  athlete_name text not null,
  photo_url text,

  -- Athletic info
  sport text not null,                        -- e.g. "Football", "Basketball", "Other"
  sport_other text,                           -- free-text when sport = 'Other'
  position text,                              -- e.g. "Wide Receiver"
  grad_year integer,
  school_name text,
  state text not null,                        -- two-letter state code, e.g. "IN"

  -- Profile content
  bio text,
  gpa numeric(3,2),

  -- Social metrics (manually entered for MVP; can be API-synced later)
  instagram_handle text,
  instagram_followers integer,
  tiktok_handle text,
  tiktok_followers integer,
  engagement_rate numeric(4,2),               -- percentage, e.g. 4.80

  -- Visibility
  is_published boolean not null default false,
  is_owner_viewing_banner boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_athlete_profiles_owner on athlete_profiles(owner_id);
create index idx_athlete_profiles_slug on athlete_profiles(slug);
create index idx_athlete_profiles_state on athlete_profiles(state);
create index idx_athlete_profiles_sport on athlete_profiles(sport);

-- ─── RATE CARDS ──────────────────────────────────────────────────────
-- Itemized pricing per athlete. Multiple rows per athlete profile.
create table rate_cards (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athlete_profiles(id) on delete cascade,

  deliverable_type text not null,             -- e.g. "Instagram Post", "Appearance / Event"
  description text,
  price numeric(10,2) not null,
  display_order integer not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_rate_cards_athlete on rate_cards(athlete_id);

-- ─── COMPLIANCE STATUS ───────────────────────────────────────────────
-- Snapshot of state-level NIL eligibility for an athlete's state.
-- Updated when state_rules table changes or athlete changes state.
create table compliance_status (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athlete_profiles(id) on delete cascade,

  state text not null,
  status text not null default 'pending',    -- 'verified' | 'pending' | 'restricted'
  last_verified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(athlete_id)
);

create index idx_compliance_status_athlete on compliance_status(athlete_id);

-- ─── STATE RULES (reference table) ──────────────────────────────────
-- Plain-English NIL rules per state. Powers the compliance engine.
create table state_rules (
  state_code text primary key,                -- e.g. "IN"
  state_name text not null,
  nil_status text not null,                   -- 'active' | 'pending' | 'prohibited'
  effective_date date,
  prohibited_categories text[],               -- e.g. ARRAY['gambling','alcohol','school_ip']
  requires_ad_notification boolean not null default false,
  summary text,
  last_verified_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table athlete_profiles enable row level security;
alter table rate_cards enable row level security;
alter table compliance_status enable row level security;
alter table state_rules enable row level security;

-- Athlete profiles: public can view published profiles; owners can manage their own
create policy "Public profiles are viewable by everyone"
  on athlete_profiles for select
  using (is_published = true);

create policy "Owners can view their own profile"
  on athlete_profiles for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own profile"
  on athlete_profiles for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own profile"
  on athlete_profiles for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own profile"
  on athlete_profiles for delete
  using (auth.uid() = owner_id);

-- Rate cards: visible if parent profile is published; owners can manage
create policy "Rate cards visible if profile is published"
  on rate_cards for select
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = rate_cards.athlete_id
      and athlete_profiles.is_published = true
    )
  );

create policy "Owners can view their own rate cards"
  on rate_cards for select
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = rate_cards.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

create policy "Owners can manage their own rate cards"
  on rate_cards for all
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = rate_cards.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

-- Compliance status: visible if profile published; owners can view their own
create policy "Compliance status visible if profile is published"
  on compliance_status for select
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = compliance_status.athlete_id
      and athlete_profiles.is_published = true
    )
  );

create policy "Owners can view their own compliance status"
  on compliance_status for select
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = compliance_status.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

-- State rules: public read-only reference data
create policy "State rules are viewable by everyone"
  on state_rules for select
  using (true);

-- =====================================================================
-- TRIGGERS — updated_at maintenance
-- =====================================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_athlete_profiles_updated_at
  before update on athlete_profiles
  for each row execute function set_updated_at();

create trigger trg_rate_cards_updated_at
  before update on rate_cards
  for each row execute function set_updated_at();

create trigger trg_compliance_status_updated_at
  before update on compliance_status
  for each row execute function set_updated_at();

-- =====================================================================
-- SEED DATA — Indiana NIL rules (launch state)
-- =====================================================================

insert into state_rules (
  state_code, state_name, nil_status, effective_date,
  prohibited_categories, requires_ad_notification, summary
) values (
  'IN', 'Indiana', 'active', '2026-07-01',
  array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
  true,
  'Indiana allows high school NIL deals effective the 2026-27 school year. Personal branding deals (social posts, appearances, endorsements) are allowed. Deals cannot use school logos, uniforms, or mascots. Prohibited categories: gambling, alcohol, and banned substances. NIL deals cannot be tied to recruiting or transfers. FTC disclosure (#ad or #sponsored) required in the first three lines of any paid post.'
);
