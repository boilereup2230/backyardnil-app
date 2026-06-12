-- =====================================================================
-- BackyardNIL — Additional State NIL Rules
-- Expands compliance engine coverage beyond Indiana.
-- Summaries are intentionally general/plain-English starting points —
-- not legal advice. "last_verified_at" should be reviewed and updated
-- periodically as state rules evolve.
-- =====================================================================

insert into state_rules (
  state_code, state_name, nil_status, effective_date,
  prohibited_categories, requires_ad_notification, summary
) values
  (
    'OH', 'Ohio', 'active', '2024-04-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Ohio allows high school athletes to enter NIL agreements with brands and businesses. Deals cannot use school logos, uniforms, or facilities without separate permission, and cannot be tied to enrollment or transfer decisions. Standard FTC disclosure rules apply to all paid posts.'
  ),
  (
    'IL', 'Illinois', 'active', '2024-08-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Illinois permits high school NIL activity through the IHSA. Athletes may not use school marks, logos, or uniforms in promotions. Deals must be reported as required by the school district and cannot influence recruiting or enrollment.'
  ),
  (
    'MI', 'Michigan', 'active', '2024-05-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Michigan high school athletes may participate in NIL deals under MHSAA guidelines. School logos, mascots, and uniforms may not be used without separate licensing. Standard advertising disclosure rules apply.'
  ),
  (
    'MO', 'Missouri', 'active', '2024-07-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Missouri permits high school NIL deals under MSHSAA policy. Athletes cannot use school IP (logos, mascots, uniforms) and deals cannot be conditioned on recruitment or transfer. FTC disclosure required on sponsored content.'
  ),
  (
    'FL', 'Florida', 'active', '2024-01-01',
    array['gambling','alcohol','banned_substances','school_ip'],
    true,
    'Florida was an early adopter of high school NIL and permits broad participation under FHSAA guidelines. School branding restrictions and standard ad-disclosure rules apply.'
  ),
  (
    'TX', 'Texas', 'active', '2024-08-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Texas permits high school NIL activity under UIL guidelines. School logos and uniforms may not be used in promotions, and deals cannot be tied to recruiting or transfers. Standard FTC disclosure applies.'
  ),
  (
    'CA', 'California', 'active', '2023-01-01',
    array['gambling','alcohol','banned_substances','school_ip'],
    true,
    'California permits high school NIL participation under CIF guidelines, among the earliest states to do so. Athletes must avoid using school branding without authorization and must follow standard advertising disclosure rules.'
  ),
  (
    'GA', 'Georgia', 'active', '2024-06-01',
    array['gambling','alcohol','banned_substances','school_ip','recruiting_tied'],
    true,
    'Georgia permits high school NIL deals under GHSA policy. School logos, mascots, and uniforms are off-limits without separate agreements, and deals cannot be used as recruiting inducements.'
  ),
  (
    'AL', 'Alabama', 'prohibited', null,
    array[]::text[],
    false,
    'As of the most recent update, Alabama does not permit high school athletes to enter NIL agreements. Families in Alabama should check AHSAA policy directly before pursuing any sponsorship activity, as rules can change.'
  ),
  (
    'WY', 'Wyoming', 'prohibited', null,
    array[]::text[],
    false,
    'As of the most recent update, Wyoming does not permit high school NIL activity under WHSAA rules. Families should verify current policy directly with WHSAA before pursuing sponsorships.'
  ),
  (
    'HI', 'Hawaii', 'prohibited', null,
    array[]::text[],
    false,
    'As of the most recent update, Hawaii does not permit high school NIL activity. Families should verify current HHSAA policy directly before pursuing sponsorships.'
  ),
  (
    'MS', 'Mississippi', 'prohibited', null,
    array[]::text[],
    false,
    'As of the most recent update, Mississippi does not permit high school NIL activity under MHSAA rules. Families should verify current policy directly with MHSAA before pursuing sponsorships.'
  )
on conflict (state_code) do nothing;
