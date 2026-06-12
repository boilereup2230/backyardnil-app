// Maps internal prohibited_categories codes (from state_rules) to
// plain-English labels with a short icon for display in the compliance UI.
export const PROHIBITED_CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  gambling: { label: 'Gambling / sports betting deals', icon: '🚫' },
  alcohol: { label: 'Alcohol brand deals', icon: '🚫' },
  banned_substances: { label: 'Banned substances / supplements', icon: '🚫' },
  school_ip: { label: 'School logos, mascots, or uniforms', icon: '🚫' },
  recruiting_tied: { label: 'Deals tied to recruiting or transfers', icon: '🚫' },
};

export function formatProhibitedCategory(code: string) {
  return PROHIBITED_CATEGORY_LABELS[code] ?? { label: code, icon: '🚫' };
}
