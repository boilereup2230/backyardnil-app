'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Converts "Marcus Webb" -> "marcus-webb", strips special chars, appends
// a short random suffix if the slug is already taken.
function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
  currentAthleteId?: string
) {
  let slug = baseSlug;
  let attempt = 0;

  while (attempt < 10) {
    const query = supabase
      .from('athlete_profiles')
      .select('id')
      .eq('slug', slug);

    const { data } = await query.maybeSingle();

    if (!data || data.id === currentAthleteId) {
      return slug;
    }

    attempt += 1;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const athleteId = formData.get('athlete_id') as string | null;

  const athleteName = (formData.get('athlete_name') as string).trim();
  const sport = formData.get('sport') as string;
  const sportOther = (formData.get('sport_other') as string)?.trim() || null;
  const position = (formData.get('position') as string)?.trim() || null;
  const gradYearRaw = formData.get('grad_year') as string;
  const gradYear = gradYearRaw ? parseInt(gradYearRaw, 10) : null;
  const schoolName = (formData.get('school_name') as string)?.trim() || null;
  const state = formData.get('state') as string;
  const bio = (formData.get('bio') as string)?.trim() || null;
  const gpaRaw = formData.get('gpa') as string;
  const gpa = gpaRaw ? parseFloat(gpaRaw) : null;

  const instagramHandle = (formData.get('instagram_handle') as string)?.trim() || null;
  const instagramFollowersRaw = formData.get('instagram_followers') as string;
  const instagramFollowers = instagramFollowersRaw ? parseInt(instagramFollowersRaw, 10) : null;

  const tiktokHandle = (formData.get('tiktok_handle') as string)?.trim() || null;
  const tiktokFollowersRaw = formData.get('tiktok_followers') as string;
  const tiktokFollowers = tiktokFollowersRaw ? parseInt(tiktokFollowersRaw, 10) : null;

  const twitterHandle = (formData.get('twitter_handle') as string)?.trim() || null;
  const twitterFollowersRaw = formData.get('twitter_followers') as string;
  const twitterFollowers = twitterFollowersRaw ? parseInt(twitterFollowersRaw, 10) : null;

  const engagementRateRaw = formData.get('engagement_rate') as string;
  const engagementRate = engagementRateRaw ? parseFloat(engagementRateRaw) : null;

  const photoUrl = (formData.get('photo_url') as string)?.trim() || null;

  const isPublished = formData.get('is_published') === 'on';

  const baseData = {
    athlete_name: athleteName,
    sport,
    sport_other: sport === 'Other' ? sportOther : null,
    position,
    grad_year: gradYear,
    school_name: schoolName,
    state,
    bio,
    gpa,
    instagram_handle: instagramHandle,
    instagram_followers: instagramFollowers,
    tiktok_handle: tiktokHandle,
    tiktok_followers: tiktokFollowers,
    twitter_handle: twitterHandle,
    twitter_followers: twitterFollowers,
    engagement_rate: engagementRate,
    photo_url: photoUrl,
    is_published: isPublished,
  };

  let resolvedAthleteId = athleteId;

  if (athleteId) {
    // Update existing profile
    const { error } = await supabase
      .from('athlete_profiles')
      .update(baseData)
      .eq('id', athleteId)
      .eq('owner_id', user.id);

    if (error) {
      redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
    }
  } else {
    // Create new profile — generate a unique slug from the name
    const baseSlug = slugify(athleteName) || 'athlete';
    const slug = await ensureUniqueSlug(supabase, baseSlug);

    const { data: inserted, error } = await supabase
      .from('athlete_profiles')
      .insert({
        owner_id: user.id,
        slug,
        ...baseData,
      })
      .select('id')
      .single();

    if (error) {
      redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
    }

    resolvedAthleteId = inserted?.id ?? null;
  }

  // Sync compliance_status to reflect the athlete's current state.
  // Looks up state_rules and snapshots a status: 'verified' if the state
  // actively allows NIL, 'pending' if rules are pending/unclear, and
  // 'restricted' if the state currently prohibits high school NIL.
  if (resolvedAthleteId) {
    const { data: rule } = await supabase
      .from('state_rules')
      .select('nil_status')
      .eq('state_code', state)
      .maybeSingle();

    const status =
      rule?.nil_status === 'active'
        ? 'verified'
        : rule?.nil_status === 'prohibited'
        ? 'restricted'
        : 'pending';

    await supabase
      .from('compliance_status')
      .upsert(
        {
          athlete_id: resolvedAthleteId,
          state,
          status,
          last_verified_at: new Date().toISOString(),
        },
        { onConflict: 'athlete_id' }
      );
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard/compliance');
  redirect('/dashboard');
}
