'use client';

import { useState } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  helpText: string;
}

function buildChecklist(disclosureRequired: boolean): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: 'category',
      label: 'This deal does not involve a prohibited category',
      helpText:
        'Check the prohibited categories above — gambling, alcohol, banned substances, and similar deals are typically not allowed.',
    },
    {
      id: 'school_ip',
      label: 'No school logos, mascots, or uniforms are used',
      helpText:
        'The brand cannot use your athlete\u2019s school name, logo, mascot, or uniform in any promotional material without separate authorization.',
    },
    {
      id: 'recruiting',
      label: 'This deal is not tied to recruiting or a transfer',
      helpText:
        'Payment or deal terms cannot be conditioned on enrollment, transfer, or recruiting decisions.',
    },
    {
      id: 'payment_basis',
      label: 'Payment is tied to a deliverable, not athletic performance',
      helpText:
        'NIL compensation should be for a specific deliverable (a post, an appearance) — not contingent on game outcomes or stats.',
    },
  ];

  if (disclosureRequired) {
    items.push({
      id: 'disclosure',
      label: 'The post will include proper #ad / #sponsored disclosure',
      helpText:
        'FTC rules require clear disclosure in the first three lines of text posts, or within the first few seconds of video.',
    });
  }

  items.push({
    id: 'school_notified',
    label: 'The school or athletic director has been notified, if required',
    helpText:
      'Some states or districts require notifying the school before accepting a deal. When in doubt, send a quick heads-up.',
  });

  return items;
}

export function DealChecklist({ disclosureRequired }: { disclosureRequired: boolean }) {
  const items = buildChecklist(disclosureRequired);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === items.length;

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-grass border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber">
          Deal Checklist
        </h2>
        <span className="text-[11px] text-chalk/35">
          {checkedCount} / {items.length}
        </span>
      </div>
      <p className="text-xs text-chalk/40 mb-4">
        Before accepting a brand deal, walk through these items. This isn&apos;t
        saved or sent anywhere — it&apos;s just a quick gut-check for you.
      </p>

      <div className="space-y-2.5">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 bg-black/15 rounded-lg px-3.5 py-3 cursor-pointer hover:bg-black/25 transition-colors"
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-0.5 w-4 h-4 accent-amber flex-shrink-0"
            />
            <div>
              <div
                className={`text-sm transition-colors ${
                  checked[item.id] ? 'text-chalk/50 line-through' : 'text-chalk'
                }`}
              >
                {item.label}
              </div>
              <div className="text-[11px] text-chalk/35 mt-0.5">
                {item.helpText}
              </div>
            </div>
          </label>
        ))}
      </div>

      {allChecked && (
        <div className="mt-4 flex items-center gap-2.5 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-3">
          <span className="text-base leading-none">✅</span>
          <span>
            Looks good! All checklist items are covered. If you&apos;re still
            unsure about a deal&apos;s terms, it&apos;s always okay to ask the
            brand for clarification in writing.
          </span>
        </div>
      )}
    </div>
  );
}
