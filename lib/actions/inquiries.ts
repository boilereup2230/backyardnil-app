'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function submitInquiry(formData: FormData) {
  const athleteId = formData.get('athlete_id') as string;
  const slug = formData.get('slug') as string;

  const brandName = (formData.get('brand_name') as string).trim();
  const contactName = (formData.get('contact_name') as string)?.trim() || null;
  const contactEmail = (formData.get('contact_email') as string).trim();
  const contactPhone = (formData.get('contact_phone') as string)?.trim() || null;
  const rateCardId = (formData.get('rate_card_id') as string) || null;
  const message = (formData.get('message') as string).trim();

  if (!brandName || !contactEmail || !message) {
    redirect(`/a/${slug}?inquiry=error`);
  }

  const supabase = await createClient();

  const { error } = await supabase.from('inquiries').insert({
    athlete_id: athleteId,
    brand_name: brandName,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    rate_card_id: rateCardId || null,
    message,
  });

  if (error) {
    redirect(`/a/${slug}?inquiry=error`);
  }

  redirect(`/a/${slug}?inquiry=success`);
}

// ─── Dashboard-side actions ─────────────────────────────────────────

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

export async function markInquiryStatus(formData: FormData) {
  const supabase = await createClient();
  const athleteId = await getOwnedAthleteId(supabase);

  const inquiryId = formData.get('inquiry_id') as string;
  const status = formData.get('status') as string;

  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', inquiryId)
    .eq('athlete_id', athleteId);

  if (error) {
    redirect(`/dashboard/inquiries?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/inquiries');
  revalidatePath('/dashboard');
  redirect('/dashboard/inquiries');
}
