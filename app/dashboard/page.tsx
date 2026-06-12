import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { AthleteProfile, RateCard } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('owner_id', user!.id)
    .maybeSingle();

  if (!profile) {
    return <EmptyState />;
  }

  const athlete = profile as AthleteProfile;

  const [{ data: rateCards }, { count: newInquiryCount }] = await Promise.all([
    supabase
      .from('rate_cards')
      .select('*')
      .eq('athlete_id', athlete.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', athlete.id)
      .eq('status', 'new'),
  ]);

  return (
    <ProfileOverview
      athlete={athlete}
      rateCards={(rateCards ?? []) as RateCard[]}
      newInquiryCount={newInquiryCount ?? 0}
    />
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="font-display font-bold text-3xl tracking-wide text-chalk mb-3">
        Let&apos;s build your athlete&apos;s profile
      </div>
      <p className="text-chalk/50 text-sm max-w-sm mx-auto mb-8">
        Add your athlete&apos;s sport, school, and stats to create their
        public profile and rate card. You can publish whenever you&apos;re
        ready — nothing goes live until you say so.
      </p>
      <Link
        href="/dashboard/profile"
        className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
      >
        Create Profile
      </Link>
    </div>
  );
}

function ProfileOverview({
  athlete,
  rateCards,
  newInquiryCount,
}: {
  athlete: AthleteProfile;
  rateCards: RateCard[];
  newInquiryCount: number;
}) {
  const displaySport =
    athlete.sport === 'Other' && athlete.sport_other
      ? athlete.sport_other
      : athlete.sport;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-display font-bold text-3xl tracking-wide text-chalk">
            {athlete.athlete_name}
          </div>
          <p className="text-chalk/50 text-sm mt-1">
            {displaySport}
            {athlete.position ? ` · ${athlete.position}` : ''}
            {athlete.school_name ? ` · ${athlete.school_name}` : ''}
          </p>
        </div>
        <div
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
            athlete.is_published
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : 'bg-amber/10 text-amber border border-amber/20'
          }`}
        >
          {athlete.is_published ? 'Published' : 'Draft'}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Profile"
          description="Edit your athlete's sport, bio, stats, and social links."
          href="/dashboard/profile"
          cta="Edit Profile"
        />
        <DashboardCard
          title="Rate Card"
          description={`${rateCards.length} rate${rateCards.length === 1 ? '' : 's'} listed.`}
          href="/dashboard/rates"
          cta="Manage Rates"
        />
        <DashboardCard
          title="Inquiries"
          description={
            newInquiryCount > 0
              ? `${newInquiryCount} new inquir${newInquiryCount === 1 ? 'y' : 'ies'} waiting.`
              : 'No new inquiries.'
          }
          href="/dashboard/inquiries"
          cta="View Inquiries"
          badge={newInquiryCount > 0 ? newInquiryCount : undefined}
        />
        <DashboardCard
          title="Compliance"
          description="State NIL rules and a deal checklist for your athlete."
          href="/dashboard/compliance"
          cta="View Compliance"
        />
      </div>

      {athlete.is_published && (
        <div className="bg-grass border border-amber/15 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-chalk">
              Your profile is live
            </div>
            <div className="text-xs text-chalk/40 mt-0.5">
              backyardnil.com/a/{athlete.slug}
            </div>
          </div>
          <Link
            href={`/a/${athlete.slug}`}
            target="_blank"
            className="text-xs font-bold text-amber hover:underline whitespace-nowrap ml-4"
          >
            View →
          </Link>
        </div>
      )}
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  cta,
  badge,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  badge?: number;
}) {
  return (
    <div className="bg-grass border border-white/5 rounded-xl p-5 relative">
      {badge !== undefined && (
        <div className="absolute top-4 right-4 bg-amber text-turf text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </div>
      )}
      <div className="font-display font-bold text-xl tracking-wide text-chalk mb-1">
        {title}
      </div>
      <p className="text-xs text-chalk/45 mb-4 leading-relaxed">{description}</p>
      <Link href={href} className="text-xs font-bold text-amber hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
