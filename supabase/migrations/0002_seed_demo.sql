-- =====================================================================
-- BackyardNIL — Demo Seed Data
-- Run after a user has signed up; replace OWNER_ID with a real auth.users id
-- =====================================================================

-- Replace this with an actual user id from auth.users after signup:
-- select id from auth.users where email = 'you@example.com';

do $$
declare
  v_owner_id uuid := '00000000-0000-0000-0000-000000000000'; -- REPLACE ME
  v_athlete_id uuid;
begin
  insert into athlete_profiles (
    owner_id, slug, athlete_name, sport, position, grad_year,
    school_name, state, bio, gpa,
    instagram_handle, instagram_followers,
    tiktok_handle, tiktok_followers,
    engagement_rate, is_published
  ) values (
    v_owner_id, 'demo', 'Marcus Webb', 'Football', 'Wide Receiver', 2027,
    'Carmel High School', 'IN',
    'Three-year varsity starter. Indiana 4A All-State honorable mention. Track athlete in the offseason.',
    3.92,
    '@marcuswebb_wr', 12400,
    '@marcuswebb', 8200,
    4.80, true
  )
  returning id into v_athlete_id;

  insert into rate_cards (athlete_id, deliverable_type, description, price, display_order)
  values
    (v_athlete_id, 'Instagram Post', 'Single feed post with product placement', 150, 1),
    (v_athlete_id, 'TikTok Video', '15-30 second branded content video', 200, 2),
    (v_athlete_id, 'Appearance / Event', 'In-person appearance, up to 2 hours', 300, 3),
    (v_athlete_id, 'Camp Instruction (hr)', 'Youth camp or clinic coaching', 75, 4);

  insert into compliance_status (athlete_id, state, status, last_verified_at)
  values (v_athlete_id, 'IN', 'verified', now());

end $$;
