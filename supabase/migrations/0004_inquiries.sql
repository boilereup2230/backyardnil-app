-- =====================================================================
-- BackyardNIL — Inquiries
-- Brand/business inquiries submitted from a public athlete profile.
-- =====================================================================

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athlete_profiles(id) on delete cascade,

  -- Who's reaching out
  brand_name text not null,
  contact_name text,
  contact_email text not null,
  contact_phone text,

  -- What they want
  rate_card_id uuid references rate_cards(id) on delete set null,
  message text not null,

  -- Status tracking
  status text not null default 'new',     -- 'new' | 'read' | 'responded' | 'archived'

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_inquiries_athlete on inquiries(athlete_id);
create index idx_inquiries_status on inquiries(status);
create index idx_inquiries_created on inquiries(created_at desc);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table inquiries enable row level security;

-- Anyone can submit an inquiry to a published profile (public insert,
-- but only for athlete_ids that correspond to published profiles).
create policy "Anyone can submit an inquiry to a published profile"
  on inquiries for insert
  with check (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = inquiries.athlete_id
      and athlete_profiles.is_published = true
    )
  );

-- Owners can view and manage inquiries for their own athlete
create policy "Owners can view their own inquiries"
  on inquiries for select
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = inquiries.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

create policy "Owners can update their own inquiries"
  on inquiries for update
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = inquiries.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

create policy "Owners can delete their own inquiries"
  on inquiries for delete
  using (
    exists (
      select 1 from athlete_profiles
      where athlete_profiles.id = inquiries.athlete_id
      and athlete_profiles.owner_id = auth.uid()
    )
  );

-- =====================================================================
-- TRIGGER — updated_at maintenance
-- =====================================================================

create trigger trg_inquiries_updated_at
  before update on inquiries
  for each row execute function set_updated_at();
