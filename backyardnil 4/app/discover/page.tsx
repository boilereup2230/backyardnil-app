import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AthleteDirectoryCard } from '@/components/athlete-directory-card';
import { US_STATES } from '@/lib/data/states';
import { ALL_SPORTS } from '@/lib/data/sports';
import type { AthleteProfile } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ state?: string; sport?: string }>;
}

const selectClasses =
  'bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-chalk ' +
  'focus:outline-none focus:border-amber transition-colors appearance-none';

export default async function DiscoverPage({ searchParams }: PageProps) {
  const { state, sport } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from('athlete_profiles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (state) {
    query = query.eq('state', state);
  }
  if (sport) {
    query = query.eq('sport', sport);
  }

  const { data: athletes } = await query;
  const items = (athletes ?? []) as AthleteProfile[];

  // Only show state options for states with at least one published athlete
  const { data: stateRows } = await supabase
    .from('athlete_profiles')
    .select('state')
    .eq('is_published', true);

  const activeStateCodes = new Set((stateRows ?? []).map((r) => r.state as string));
  const availableStates = US_STATES.filter((s) => activeStateCodes.has(s.code));

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="font-display font-bold text-4xl tracking-wide text-chalk">
            Find Local Athletes
          </div>
          <p className="text-chalk/50 text-sm mt-2 max-w-lg">
            Browse high school athletes building their brand in your community.
            Filter by sport and state, then reach out directly from their profile.
          </p>
        </div>

        {/* Filters */}
        <form className="flex flex-wrap items-center gap-3 mb-8" method="get">
          <select name="sport" defaultValue={sport ?? ''} className={selectClasses}>
            <option value="">All Sports</option>
            {ALL_SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select name="state" defaultValue={state ?? ''} className={selectClasses}>
            <option value="">All States</option>
            {availableStates.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-amber text-turf font-bold text-sm px-5 py-2 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Filter
          </button>

          {(state || sport) && (
            <Link
              href="/discover"
              className="text-xs font-semibold text-chalk/40 hover:text-chalk transition-colors"
            >
              Clear filters
            </Link>
          )}
        </form>

        {/* Results */}
        {items.length === 0 ? (
          <EmptyState hasFilters={!!(state || sport)} />
        ) : (
          <>
            <p className="text-xs text-chalk/35 mb-4">
              {items.length} athlete{items.length === 1 ? '' : 's'}
              {sport ? ` in ${sport}` : ''}
              {state ? ` · ${availableStates.find((s) => s.code === state)?.name ?? state}` : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((athlete) => (
                <AthleteDirectoryCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="bg-grass border border-white/5 rounded-xl p-10 text-center">
      <p className="text-sm text-chalk/50 max-w-sm mx-auto">
        {hasFilters
          ? 'No athletes match these filters yet. Try broadening your search or check back soon as more athletes join.'
          : 'No published athlete profiles yet. Check back soon as families join BackyardNIL.'}
      </p>
      {hasFilters && (
        <Link
          href="/discover"
          className="inline-block mt-4 text-xs font-bold text-amber hover:underline"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}
