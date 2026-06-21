import Link from 'next/link';
import Image from 'next/image';
import type { AthleteProfile } from '@/lib/types';
const getDisplaySport = (athlete: AthleteProfile) =>
  athlete.sport === 'Other' && athlete.sport_other
    ? athlete.sport_other
    : athlete.sport;
const formatFollowers = (count: number | null) => {
  if (!count) return null;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
};
export function AthleteDirectoryCard({ athlete }: { athlete: AthleteProfile }) {
  const igFollowers = formatFollowers(athlete.instagram_followers);
  const ttFollowers = formatFollowers(athlete.tiktok_followers);
  return (
    <Link
      href={`/a/${athlete.slug}`}
      className="block bg-grass border border-white/5 rounded-xl p-5 hover:border-amber/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        {athlete.photo_url ? (
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber/20 flex-shrink-0">
            <Image
              src={athlete.photo_url}
              alt={athlete.athlete_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-sm text-amber">
              {athlete.athlete_name.charAt(0)}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <div className="font-display font-bold text-lg tracking-wide text-chalk leading-tight truncate">
            {athlete.athlete_name}
          </div>
          <div className="text-xs text-chalk/40 truncate">
            {athlete.school_name ?? athlete.state}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber bg-amber/10 border border-amber/20 rounded-full px-2.5 py-1">
          {getDisplaySport(athlete)}
          {athlete.position ? ` · ${athlete.position}` : ''}
        </span>
        {athlete.grad_year && (
          <span className="text-[10px] font-semibold text-chalk/40">
            Class of {athlete.grad_year}
          </span>
        )}
      </div>
      {athlete.featured_badge_text && (
        <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-turf bg-amber rounded-full px-2.5 py-1 mb-3">
          {athlete.featured_badge_text}
        </div>
      )}
      {athlete.bio && (
        <p className="text-xs text-chalk/50 leading-relaxed mb-3 line-clamp-2">
          {athlete.bio}
        </p>
      )}
      {(igFollowers || ttFollowers) && (
        <div className="flex items-center gap-3 text-[11px] text-chalk/35 font-medium">
          {igFollowers && <span>{igFollowers} Instagram</span>}
          {ttFollowers && <span>{ttFollowers} TikTok</span>}
        </div>
      )}
    </Link>
  );
}
