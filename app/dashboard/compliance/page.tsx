import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { AthleteProfile, ComplianceStatus, StateRule } from '@/lib/types';
import { formatProhibitedCategory } from '@/lib/data/compliance-labels';
import { DealChecklist } from './deal-checklist';

const NIL_STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  active: {
    label: 'NIL Active',
    classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  pending: {
    label: 'Pending / Unclear',
    classes: 'bg-amber/10 text-amber border-amber/20',
  },
  prohibited: {
    label: 'Not Currently Permitted',
    classes: 'bg-red-500/10 text-red-300 border-red-500/20',
  },
};

export default async function CompliancePage() {
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
          Your state&apos;s NIL compliance info will appear here once your
          athlete&apos;s profile is set up.
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

  const [{ data: stateRule }, { data: compliance }] = await Promise.all([
    supabase
      .from('state_rules')
      .select('*')
      .eq('state_code', athlete.state)
      .maybeSingle(),
    supabase
      .from('compliance_status')
      .select('*')
      .eq('athlete_id', athlete.id)
      .maybeSingle(),
  ]);

  const rule = stateRule as StateRule | null;
  const compStatus = compliance as ComplianceStatus | null;

  return (
    <div>
      <div className="mb-8">
        <div className="font-display font-bold text-3xl tracking-wide text-chalk">
          Compliance Center
        </div>
        <p className="text-chalk/50 text-sm mt-1">
          Plain-English NIL rules for {athlete.athlete_name}&apos;s state, and a
          quick checklist to run through before accepting any deal.
        </p>
      </div>

      {!rule ? (
        <NoRuleYet stateCode={athlete.state} />
      ) : (
        <StateRuleCard rule={rule} compStatus={compStatus} />
      )}

      <div className="mt-8">
        <DealChecklist disclosureRequired={rule?.requires_ad_notification ?? true} />
      </div>

      <div className="mt-8 text-xs text-chalk/30 leading-relaxed">
        This page provides general compliance guidance based on publicly
        available state athletic association rules and is not legal advice.
        For deals involving significant compensation or complex
        arrangements, consult a qualified sports attorney.
      </div>
    </div>
  );
}

function NoRuleYet({ stateCode }: { stateCode: string }) {
  return (
    <div className="bg-grass border border-white/5 rounded-xl p-5">
      <div className="text-sm font-semibold text-chalk mb-1">
        No rules on file yet for {stateCode}
      </div>
      <p className="text-xs text-chalk/40">
        We don&apos;t have compliance information loaded for this state yet.
        BackyardNIL is launching state-by-state — check back soon, or
        contact us if you&apos;d like your state prioritized.
      </p>
    </div>
  );
}

function StateRuleCard({
  rule,
  compStatus,
}: {
  rule: StateRule;
  compStatus: ComplianceStatus | null;
}) {
  const statusStyle = NIL_STATUS_STYLES[rule.nil_status] ?? NIL_STATUS_STYLES.pending;
  const categories = rule.prohibited_categories ?? [];

  return (
    <div className="bg-grass border border-amber/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="font-display font-bold text-2xl tracking-wide text-chalk">
          {rule.state_name}
        </div>
        <div
          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyle.classes}`}
        >
          {statusStyle.label}
        </div>
      </div>

      {rule.effective_date && rule.nil_status === 'active' && (
        <p className="text-xs text-chalk/35 mb-4">
          Effective {new Date(rule.effective_date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}

      {rule.summary && (
        <p className="text-sm text-chalk/70 leading-relaxed mb-5">
          {rule.summary}
        </p>
      )}

      {categories.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-chalk/35 mb-2">
            Prohibited Deal Categories
          </div>
          <div className="space-y-2">
            {categories.map((code) => {
              const { label, icon } = formatProhibitedCategory(code);
              return (
                <div
                  key={code}
                  className="flex items-start gap-2.5 text-sm text-chalk/65 bg-black/15 rounded-lg px-3 py-2"
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rule.requires_ad_notification && (
        <div className="flex items-start gap-2.5 text-sm text-chalk/65 bg-black/15 rounded-lg px-3 py-2 mb-5">
          <span className="text-base leading-none">✅</span>
          <span>
            FTC disclosure (#ad or #sponsored) required in the first three
            lines of any paid post or within the first few seconds of video.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-chalk/30 pt-3 border-t border-white/5">
        <span>
          Last verified{' '}
          {new Date(rule.last_verified_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        {compStatus && (
          <span className="capitalize">
            Profile status: {compStatus.status}
          </span>
        )}
      </div>
    </div>
  );
}
