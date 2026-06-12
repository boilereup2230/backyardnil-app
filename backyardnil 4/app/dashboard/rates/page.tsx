import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { AthleteProfile, RateCard } from '@/lib/types';
import { addRateCard, deleteRateCard, toggleRateCardActive } from '@/lib/actions/rates';
import { FormField } from '@/components/form-field';
import { RATE_DELIVERABLE_SUGGESTIONS } from '@/lib/data/rate-suggestions';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

export default async function RatesPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

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
          You&apos;ll need to set up your athlete&apos;s profile before adding rates.
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

  const { data: rateCards } = await supabase
    .from('rate_cards')
    .select('*')
    .eq('athlete_id', athlete.id)
    .order('display_order', { ascending: true });

  const rates = (rateCards ?? []) as RateCard[];

  return (
    <div>
      <div className="mb-8">
        <div className="font-display font-bold text-3xl tracking-wide text-chalk">
          Rate Card
        </div>
        <p className="text-chalk/50 text-sm mt-1">
          Set what {athlete.athlete_name} charges for each type of deliverable.
        </p>
      </div>

      {error && (
        <div className="mb-6 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Existing rates */}
      {rates.length > 0 && (
        <div className="bg-grass border border-white/5 rounded-xl divide-y divide-white/5 mb-8">
          {rates.map((rate) => (
            <div
              key={rate.id}
              className="flex items-center justify-between px-5 py-4 gap-4"
            >
              <div className="min-w-0">
                <div className={`text-sm font-semibold ${rate.is_active ? 'text-chalk' : 'text-chalk/30 line-through'}`}>
                  {rate.deliverable_type}
                </div>
                {rate.description && (
                  <div className="text-xs text-chalk/40 mt-0.5 truncate">
                    {rate.description}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className={`font-display font-bold text-lg ${rate.is_active ? 'text-amber' : 'text-chalk/30'}`}>
                  {formatPrice(rate.price)}
                </div>

                <form action={toggleRateCardActive}>
                  <input type="hidden" name="rate_card_id" value={rate.id} />
                  <input type="hidden" name="is_active" value={String(rate.is_active)} />
                  <button
                    type="submit"
                    className="text-[11px] font-semibold text-chalk/40 hover:text-chalk transition-colors px-2 py-1"
                    title={rate.is_active ? 'Hide from profile' : 'Show on profile'}
                  >
                    {rate.is_active ? 'Hide' : 'Show'}
                  </button>
                </form>

                <form action={deleteRateCard}>
                  <input type="hidden" name="rate_card_id" value={rate.id} />
                  <button
                    type="submit"
                    className="text-[11px] font-semibold text-red-400/60 hover:text-red-400 transition-colors px-2 py-1"
                    title="Delete"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new rate */}
      <div className="bg-grass border border-amber/15 rounded-xl p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber mb-4">
          Add a Rate
        </h2>

        <form action={addRateCard} className="space-y-4">
          <div>
            <label
              htmlFor="deliverable_type"
              className="block text-xs font-semibold uppercase tracking-wider text-chalk/50 mb-1.5"
            >
              Deliverable
            </label>
            <input
              id="deliverable_type"
              name="deliverable_type"
              type="text"
              list="rate-suggestions"
              placeholder="e.g. Instagram Post"
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
            />
            <datalist id="rate-suggestions">
              {RATE_DELIVERABLE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <FormField
            label="Description (optional)"
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Single feed post with product placement"
          />

          <FormField
            label="Price (USD)"
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            placeholder="150"
            required
            className="max-w-[160px]"
          />

          <button
            type="submit"
            className="bg-amber text-turf font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Add Rate
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link href="/dashboard" className="text-xs font-semibold text-chalk/40 hover:text-chalk transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
