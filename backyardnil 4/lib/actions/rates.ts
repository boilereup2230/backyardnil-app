'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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

export async function addRateCard(formData: FormData) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const deliverableType = (formData.get('deliverable_type') as string).trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const price = parseFloat(formData.get('price') as string);

  if (!deliverableType || isNaN(price)) {
    redirect('/dashboard/rates?error=Please+fill+out+all+required+fields');
  }

  // Determine next display order
  const { data: existing } = await supabase
    .from('rate_cards')
    .select('display_order')
    .eq('athlete_id', athleteId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from('rate_cards').insert({
    athlete_id: athleteId,
    deliverable_type: deliverableType,
    description,
    price,
    display_order: nextOrder,
  });

  if (error) {
    redirect(`/dashboard/rates?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/rates');
  revalidatePath('/dashboard');
  redirect('/dashboard/rates');
}

export async function deleteRateCard(formData: FormData) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const rateCardId = formData.get('rate_card_id') as string;

  const { error } = await supabase
    .from('rate_cards')
    .delete()
    .eq('id', rateCardId)
    .eq('athlete_id', athleteId);

  if (error) {
    redirect(`/dashboard/rates?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/rates');
  revalidatePath('/dashboard');
  redirect('/dashboard/rates');
}

export async function toggleRateCardActive(formData: FormData) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const rateCardId = formData.get('rate_card_id') as string;
  const isActive = formData.get('is_active') === 'true';

  const { error } = await supabase
    .from('rate_cards')
    .update({ is_active: !isActive })
    .eq('id', rateCardId)
    .eq('athlete_id', athleteId);

  if (error) {
    redirect(`/dashboard/rates?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/rates');
  revalidatePath('/dashboard');
  redirect('/dashboard/rates');
}
