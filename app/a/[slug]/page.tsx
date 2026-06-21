import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ComplianceBadge } from '@/components/compliance-badge';
import { StatBlock } from '@/components/stat-block';
import { RateCardItem } from '@/components/rate-card-item';
import { InquiryForm } from '@/components/inquiry-form';
import type {
  AthleteProfile,
  RateCard,
  ComplianceStatus,
  StateRule,
  AthleteAward,
} from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ inquiry?: string }>;
}

async function getAthleteData(slug: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const athlete = profile as AthleteProfile;

  const [{ data: rateCards }, { data: compliance }, { data: stateRule }, { data: awards }] =
    await Promise.all([
      supabase
        .from('rate_cards')
        .select('*')
        .eq('athlete_id', athlete.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabase
        .from('compliance_status')
        .select('*')
        .eq('athlete_id', athlete.id)
        .maybeSingle(),
      supabase
        .from('state_rules')
        .select('*')
        .eq('state_code', athlete.state)
        .maybeSingle(),
      supabase
        .from('athlete_awards')
        .select('*')
        .eq('athlete_id', athlete.id)
        .order('display_order', { ascending: true }),
    ]);

  return {
    athlete,
    rateCards: (rateCards ?? []) as RateCard[],
    compliance: compliance as ComplianceStatus | null,
    stateRule: stateRule as StateRule | null,
    awards: (awards ?? []) as AthleteAward[],
  };
}

const formatFollowers = (count: number | null) => {
  if (!count) return '—';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
};

const getDisplaySport = (athlete: AthleteProfile) =>
  athlete.sport === 'Other' && athlete.sport_other
    ? athlete.sport_other
    : athlete.sport;

export default async function AthleteProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { inquiry } = await searchParams;
  const data = await getAthleteData(slug);

  if (!data) {
    notFound();
  }

  const { athlete, rateCards, compliance, stateRule, awards } = data;

  const metaLine = [
    athlete.school_name,
    athlete.club_team_name,
    athlete.grad_year ? `Class of ${athlete.grad_year}` : null,
    athlete.state,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="flex-1 flex items-center justify-center p-6 py-16">
      <div className="w-full max-w-sm">
        {athlete.is_owner_viewing_banner && (
          <div className="mb-3 text-center text-xs text-amber/70 bg-amber/10 border border-amber/20 rounded-md py-2 px-3">
            This is how your profile appears to brands and the public.
          </div>
        )}

        <div className="bg-grass border border-amber/15 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-turf-mid to-grass p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber/5" />

            <div className="relative">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber bg-amber/10 border border-amber/20 rounded-full px-3 py-1">
                  {getDisplaySport(athlete)}
                  {athlete.position ? ` · ${athlete.position}` : ''}
                </div>
                {athlete.featured_badge_text && (
                  <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-turf bg-amber rounded-full px-3 py-1">
                    {athlete.featured_badge_text}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {athlete.photo_url && (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber/30 flex-shrink-0">
                    <Image
                      src={athlete.photo_url}
                      alt={athlete.athlete_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="font-display font-bold text-3xl tracking-wide text-chalk leading-none">
                    {athlete.athlete_name}
                  </h1>
                  {metaLine && (
                    <p className="text-xs text-chalk/50 mt-1">{metaLine}</p>
                  )}
                </div>
              </div>

              {athlete.bio && (
                <p className="text-sm text-chalk/60 mt-4 leading-relaxed">
                  {athlete.bio}
                </p>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <StatBlock
                value={formatFollowers(athlete.instagram_followers)}
                label="Instagram"
              />
              <StatBlock
                value={formatFollowers(athlete.tiktok_followers)}
                label="TikTok"
              />
              <StatBlock
                value={athlete.gpa ? athlete.gpa.toFixed(2) : '—'}
                label="GPA"
              />
            </div>

            {/* Awards */}
            {awards.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-chalk/35 mb-2">
                  Awards &amp; Honors
                </div>
                <ul className="space-y-1.5">
                  {awards.map((a) => (
                    <li
                      key={a.id}
                      className="text-xs text-chalk/60 flex items-center gap-2"
                    >
                      <span className="text-amber">●</span>
                      {a.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rate Card */}
            {rateCards.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-chalk/35 mb-2">
                  Rate Card
                </div>
                <div>
                  {rateCards.map((item) => (
                    <RateCardItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry CTA */}
            <InquiryForm
              athleteId={athlete.id}
              athleteName={athlete.athlete_name}
              slug={athlete.slug}
              rateCards={rateCards}
              initialState={
                inquiry === 'success' ? 'success' : inquiry === 'error' ? 'error' : 'idle'
              }
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-black/20">
            <ComplianceBadge compliance={compliance} stateRule={stateRule} />
          </div>
        </div>

        <p className="text-center text-[11px] text-chalk/20 mt-6">
          Powered by <span className="text-amber/50">BackyardNIL</span>
        </p>
      </div>
    </main>
  );
}
