'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function getOwnedAthleteId(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('athlete_profiles')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/dashboard/profile');
  }

  return profile.id as string;
}

/**
 * Records a highlight item (photo or video) that has already been uploaded
 * to Supabase Storage from the client. Enforces a max of 6 total items and
 * at most 1 video per athlete.
 */
export async function addHighlight(input: {
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  caption?: string;
}) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const { data: existing } = await supabase
    .from('athlete_highlights')
    .select('id, media_type, display_order')
    .eq('athlete_id', athleteId);

  const items = existing ?? [];

  if (items.length >= 6) {
    return { error: 'You can have up to 6 highlight items.' };
  }

  if (input.mediaType === 'video' && items.some((i) => i.media_type === 'video')) {
    return { error: 'Only 1 video is allowed. Remove the existing video first.' };
  }

  const nextOrder =
    items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;

  const { error } = await supabase.from('athlete_highlights').insert({
    athlete_id: athleteId,
    media_type: input.mediaType,
    media_url: input.mediaUrl,
    caption: input.caption || null,
    display_order: nextOrder,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { error: null };
}

export async function deleteHighlight(highlightId: string) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const { error } = await supabase
    .from('athlete_highlights')
    .delete()
    .eq('id', highlightId)
    .eq('athlete_id', athleteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { error: null };
}
