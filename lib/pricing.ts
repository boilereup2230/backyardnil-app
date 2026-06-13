// =====================================================================
// BackyardNIL — Suggested Rate Card Pricing Engine
// =====================================================================
//
// Generates suggested per-deliverable pricing for a high school athlete
// based on their social reach (Instagram, TikTok, X/Twitter), engagement
// rate, sport, and grad year. Output is a *starting point* — athletes
// and parents can override every value before publishing.
//
// Design principles:
//  - Floor pricing ensures even small/new accounts get a reasonable
//    starting number (this is a local marketplace, not influencer-scale).
//  - Reach scales sub-linearly (sqrt-based) so a 50k-follower athlete
//    isn't priced at 5x a 10k-follower athlete — local brand budgets
//    don't scale that way.
//  - Engagement rate is a multiplier: a smaller, highly-engaged audience
//    can out-price a larger, low-engagement one.
//  - Sport tier is a mild multiplier only — football/basketball get a
//    modest bump for typical local sponsor demand, but every sport
//    gets a fair baseline.
//  - X/Twitter followers count toward reach but are weighted slightly
//    lower for per-post pricing (lower avg media engagement) while
//    contributing meaningfully to "visibility" deliverables like
//    shoutouts and recruiting-related content.

export interface PricingInputs {
  instagramFollowers?: number | null;
  tiktokFollowers?: number | null;
  twitterFollowers?: number | null;
  engagementRate?: number | null; // percentage, e.g. 4.8
  sport?: string | null;
  gradYear?: number | null;
}

export interface SuggestedRate {
  deliverableType: string;
  price: number;
  description: string;
}

// ─── Sport tier multipliers ──────────────────────────────────────────
// Mild adjustments only. Every sport defaults to 1.0 if not listed.
const SPORT_MULTIPLIERS: Record<string, number> = {
  Football: 1.15,
  Basketball: 1.15,
  Baseball: 1.05,
  Softball: 1.05,
  Soccer: 1.05,
  Wrestling: 1.0,
  Volleyball: 1.05,
  'Track & Field': 1.0,
  Cheerleading: 1.0,
  Dance: 1.0,
  Esports: 1.05,
};

const DEFAULT_SPORT_MULTIPLIER = 1.0;

// ─── Reach scoring ────────────────────────────────────────────────────
// Combines platforms into a single "reach score" using sqrt scaling so
// growth in followers has diminishing (but real) returns on price.
function reachScore(inputs: PricingInputs): number {
  const ig = inputs.instagramFollowers ?? 0;
  const tt = inputs.tiktokFollowers ?? 0;
  const tw = inputs.twitterFollowers ?? 0;

  // X/Twitter weighted at 0.7x for general reach purposes.
  const weighted = ig + tt + tw * 0.7;

  return Math.sqrt(Math.max(weighted, 0));
}

// ─── Engagement multiplier ────────────────────────────────────────────
// 4% engagement = baseline (1.0x). Above/below shifts the multiplier.
// Clamped to a reasonable band so a single outlier stat doesn't blow up
// pricing.
function engagementMultiplier(engagementRate?: number | null): number {
  if (!engagementRate || engagementRate <= 0) return 0.9; // unknown/no data — slight discount
  const baseline = 4.0;
  const ratio = engagementRate / baseline;
  return Math.min(Math.max(ratio, 0.7), 1.6);
}

function sportMultiplier(sport?: string | null): number {
  if (!sport) return DEFAULT_SPORT_MULTIPLIER;
  return SPORT_MULTIPLIERS[sport] ?? DEFAULT_SPORT_MULTIPLIER;
}

// ─── Base rates per deliverable ───────────────────────────────────────
// These represent the price at reachScore = 1 (i.e. ~1 combined follower
// — effectively the floor) before multipliers. Floors below ensure every
// deliverable has a sensible minimum regardless of reach.
interface DeliverableConfig {
  type: string;
  description: string;
  base: number;       // dollars at reachScore baseline
  perReachPoint: number; // additional dollars per reach-score point above baseline
  floor: number;       // absolute minimum suggested price
  usesTwitterBoost?: boolean; // deliverable benefits extra from X reach (recruiting visibility)
}

const REACH_BASELINE = 30; // reachScore roughly corresponding to ~1,000 combined followers

const DELIVERABLES: DeliverableConfig[] = [
  {
    type: 'Instagram Post',
    description: 'Single feed post featuring the brand/product',
    base: 60,
    perReachPoint: 2.2,
    floor: 35,
  },
  {
    type: 'Instagram Story',
    description: '24-hour story mention or feature',
    base: 30,
    perReachPoint: 1.0,
    floor: 20,
  },
  {
    type: 'Instagram Reel',
    description: 'Short-form video post on Instagram',
    base: 85,
    perReachPoint: 2.8,
    floor: 50,
  },
  {
    type: 'TikTok Video',
    description: 'Branded or sponsored TikTok video',
    base: 85,
    perReachPoint: 2.8,
    floor: 50,
  },
  {
    type: 'X / Twitter Post',
    description: 'Sponsored post or shoutout on X (Twitter)',
    base: 40,
    perReachPoint: 1.6,
    floor: 25,
    usesTwitterBoost: true,
  },
  {
    type: 'Game Day Shoutout',
    description: 'Mention or tag across social platforms on game day',
    base: 35,
    perReachPoint: 1.2,
    floor: 25,
    usesTwitterBoost: true,
  },
  {
    type: 'Appearance / Event',
    description: 'In-person appearance at a store, event, or signing',
    base: 150,
    perReachPoint: 1.5,
    floor: 100,
  },
  {
    type: 'Autograph Signing',
    description: 'Signed merchandise or photos for promotional use',
    base: 75,
    perReachPoint: 0.8,
    floor: 50,
  },
  {
    type: 'Product Review',
    description: 'Honest review/unboxing of a product across platforms',
    base: 90,
    perReachPoint: 2.5,
    floor: 60,
  },
];

/**
 * Generate suggested rate card pricing for an athlete based on their
 * profile data. Returns one suggestion per standard deliverable type.
 *
 * All prices are rounded to the nearest $5 for clean, presentable rate
 * cards.
 */
export function generateSuggestedRates(inputs: PricingInputs): SuggestedRate[] {
  const reach = reachScore(inputs);
  const engMult = engagementMultiplier(inputs.engagementRate);
  const sportMult = sportMultiplier(inputs.sport);

  const tw = inputs.twitterFollowers ?? 0;
  const twitterBoostScore = Math.sqrt(tw);

  return DELIVERABLES.map((d) => {
    const reachAbove = Math.max(reach - REACH_BASELINE, 0);
    let raw = d.base + reachAbove * d.perReachPoint;

    if (d.usesTwitterBoost && twitterBoostScore > 0) {
      raw += twitterBoostScore * 0.6;
    }

    raw = raw * engMult * sportMult;

    const price = Math.max(roundToNearest(raw, 5), d.floor);

    return {
      deliverableType: d.type,
      price,
      description: d.description,
    };
  });
}

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}
