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

export async function addAward(title: string) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const trimmed = title.trim();
  if (!trimmed) {
    return { error: 'Award title cannot be empty.' };
  }

  const { data: existing } = await supabase
    .from('athlete_awards')
    .select('display_order')
    .eq('athlete_id', athleteId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from('athlete_awards').insert({
    athlete_id: athleteId,
    title: trimmed,
    display_order: nextOrder,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { error: null };
}

export async function deleteAward(awardId: string) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const { error } = await supabase
    .from('athlete_awards')
    .delete()
    .eq('id', awardId)
    .eq('athlete_id', athleteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { error: null };
}
