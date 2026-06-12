import type { ComplianceStatus, StateRule } from '@/lib/types';

interface ComplianceBadgeProps {
  compliance: ComplianceStatus | null;
  stateRule: StateRule | null;
}

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  verified: {
    label: 'Compliance Verified',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
  },
  pending: {
    label: 'Compliance Pending',
    dot: 'bg-amber animate-pulse',
    text: 'text-amber',
  },
  restricted: {
    label: 'Review Required',
    dot: 'bg-red-400',
    text: 'text-red-300',
  },
};

export function ComplianceBadge({ compliance, stateRule }: ComplianceBadgeProps) {
  const status = compliance?.status ?? 'pending';
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-black/20 rounded-lg">
      <div className={`flex items-center gap-2 text-xs font-semibold ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {style.label}
      </div>
      {stateRule && (
        <div className="text-xs text-chalk/30 font-medium">
          {stateRule.state_name}
        </div>
      )}
    </div>
  );
}
