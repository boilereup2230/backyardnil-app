// Comprehensive high school sport/activity list for the athlete profile
// sport selector. Grouped for a clean <optgroup>-based dropdown rather
// than one flat alphabetical wall of options.
//
// Includes traditional team sports, individual sports, and spirit/performance
// programs (cheer, dance, poms) since these athletes/performers also build
// social followings and have NIL potential — especially at the local level.

export interface SportGroup {
  group: string;
  sports: string[];
}

export const SPORT_GROUPS: SportGroup[] = [
  {
    group: 'Team Sports',
    sports: [
      'Football',
      'Basketball',
      'Baseball',
      'Softball',
      'Soccer',
      'Volleyball',
      'Lacrosse',
      'Field Hockey',
      'Ice Hockey',
      'Water Polo',
      'Rugby',
    ],
  },
  {
    group: 'Individual Sports',
    sports: [
      'Track & Field',
      'Cross Country',
      'Swimming & Diving',
      'Tennis',
      'Golf',
      'Wrestling',
      'Gymnastics',
      'Bowling',
      'Skiing',
      'Snowboarding',
      'Archery',
    ],
  },
  {
    group: 'Combat Sports',
    sports: ['Boxing', 'Martial Arts / MMA', 'Fencing'],
  },
  {
    group: 'Spirit & Performance',
    sports: ['Cheerleading', 'Dance / Drill Team', 'Color Guard', 'Esports'],
  },
  {
    group: 'Other',
    sports: ['Other'],
  },
];

// Flat list (deduplicated) for cases where a simple array is needed,
// e.g. validation or search.
export const ALL_SPORTS = Array.from(
  new Set(SPORT_GROUPS.flatMap((g) => g.sports))
);
