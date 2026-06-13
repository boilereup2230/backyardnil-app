-- =====================================================================
-- BackyardNIL — Add X / Twitter fields to athlete_profiles
-- =====================================================================
alter table athlete_profiles
  add column if not exists twitter_handle text,
  add column if not exists twitter_followers integer;
