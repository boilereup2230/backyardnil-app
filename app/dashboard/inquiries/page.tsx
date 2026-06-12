import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { AthleteProfile, Inquiry, RateCard } from '@/lib/types';
import { markInquiryStatus } from '@/lib/actions/inquiries';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-amber/10 text-amber border-amber/20',
  read: 'bg-white/5 text-chalk/50 border-white/10',
  responded: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  archived: 'bg-white/5 text-chalk/30 border-white/10',
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('owner_id', user!.id)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="font-display font-bold text-2xl tracking-wide text-chalk mb-3">
          Create a profile first
        </div>
        <p className="text-chalk/50 text-sm mb-6">
          Brand inquiries will show up here once your athlete&apos;s profile
          is published.
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

  const athlete = profile as AthleteProfile;

  const [{ data: inquiries }, { data: rateCards }] = await Promise.all([
    supabase
      .from('inquiries')
      .select('*')
      .eq('athlete_id', athlete.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('rate_cards')
      .select('*')
      .eq('athlete_id', athlete.id),
  ]);

  const items = (inquiries ?? []) as Inquiry[];
  const rates = (rateCards ?? []) as RateCard[];
  const rateMap = new Map(rates.map((r) => [r.id, r]));

  const newCount = items.filter((i) => i.status === 'new').length;

  return (
    <div>
      <div className="mb-8">
        <div className="font-display font-bold text-3xl tracking-wide text-chalk">
          Inquiries
        </div>
        <p className="text-chalk/50 text-sm mt-1">
          {items.length === 0
            ? 'No inquiries yet — they\u2019ll show up here when brands reach out from your public profile.'
            : `${newCount} new ${newCount === 1 ? 'inquiry' : 'inquiries'} of ${items.length} total.`}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState athlete={athlete} />
      ) : (
        <div className="space-y-3">
          {items.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              rateCard={inquiry.rate_card_id ? rateMap.get(inquiry.rate_card_id) ?? null : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ athlete }: { athlete: AthleteProfile }) {
  return (
    <div className="bg-grass border border-white/5 rounded-xl p-8 text-center">
      <p className="text-sm text-chalk/50 mb-4">
        {athlete.is_published ? (
          <>
            Your profile is live at{' '}
            <span className="text-amber">backyardnil.com/a/{athlete.slug}</span>
            . Share it with local businesses to start getting inquiries.
          </>
        ) : (
          <>
            Your profile isn&apos;t published yet — publish it from the
            Profile page so brands can find and contact{' '}
            {athlete.athlete_name}.
          </>
        )}
      </p>
      {!athlete.is_published && (
        <Link
          href="/dashboard/profile"
          className="inline-block bg-amber text-turf font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-amber-dim transition-colors"
        >
          Go to Profile
        </Link>
      )}
    </div>
  );
}

function InquiryCard({
  inquiry,
  rateCard,
}: {
  inquiry: Inquiry;
  rateCard: RateCard | null;
}) {
  const statusStyle = STATUS_STYLES[inquiry.status] ?? STATUS_STYLES.new;

  return (
    <div className="bg-grass border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-sm font-bold text-chalk">{inquiry.brand_name}</div>
          <div className="text-xs text-chalk/40 mt-0.5">
            {inquiry.contact_name ? `${inquiry.contact_name} · ` : ''}
            {inquiry.contact_email}
            {inquiry.contact_phone ? ` · ${inquiry.contact_phone}` : ''}
          </div>
        </div>
        <div
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border whitespace-nowrap ${statusStyle}`}
        >
          {inquiry.status}
        </div>
      </div>

      {rateCard && (
        <div className="inline-block text-xs font-semibold text-amber bg-amber/10 border border-amber/20 rounded-full px-2.5 py-1 mb-3">
          {rateCard.deliverable_type} — {formatPrice(rateCard.price)}
        </div>
      )}

      <p className="text-sm text-chalk/70 leading-relaxed mb-4">
        {inquiry.message}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-chalk/30">
          {formatDate(inquiry.created_at)}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${inquiry.contact_email}`}
            className="text-[11px] font-bold text-amber hover:underline"
          >
            Reply via Email
          </a>

          {inquiry.status !== 'responded' && (
            <form action={markInquiryStatus}>
              <input type="hidden" name="inquiry_id" value={inquiry.id} />
              <input type="hidden" name="status" value="responded" />
              <button
                type="submit"
                className="text-[11px] font-semibold text-chalk/40 hover:text-chalk transition-colors px-2 py-1"
              >
                Mark Responded
              </button>
            </form>
          )}

          {inquiry.status !== 'archived' && (
            <form action={markInquiryStatus}>
              <input type="hidden" name="inquiry_id" value={inquiry.id} />
              <input type="hidden" name="status" value="archived" />
              <button
                type="submit"
                className="text-[11px] font-semibold text-chalk/30 hover:text-chalk/60 transition-colors px-2 py-1"
              >
                Archive
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
