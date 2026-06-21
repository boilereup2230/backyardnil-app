'use client';

import { useState } from 'react';
import { submitInquiry } from '@/lib/actions/inquiries';
import type { RateCard } from '@/lib/types';

interface InquiryFormProps {
  athleteId: string;
  athleteName: string;
  slug: string;
  rateCards: RateCard[];
  initialState: 'idle' | 'success' | 'error';
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

export function InquiryForm({
  athleteId,
  athleteName,
  slug,
  rateCards,
  initialState,
}: InquiryFormProps) {
  const [open, setOpen] = useState(initialState === 'error');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleRateCard(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  if (initialState === 'success') {
    return (
      <div className="flex items-start gap-2.5 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-3">
        <span className="text-base leading-none">✅</span>
        <span>
          Inquiry sent! {athleteName}&apos;s family will be in touch if it&apos;s
          a good fit.
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-amber text-turf font-bold text-sm py-3 rounded-lg hover:bg-amber-dim transition-colors"
      >
        Send Inquiry
      </button>
    );
  }

  return (
    <div className="bg-black/15 rounded-lg p-4">
      {initialState === 'error' && (
        <div className="mb-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          Something went wrong — please check the form and try again.
        </div>
      )}

      <form action={submitInquiry} className="space-y-3">
        <input type="hidden" name="athlete_id" value={athleteId} />
        <input type="hidden" name="slug" value={slug} />
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="rate_card_ids" value={id} />
        ))}

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
              Brand / Business Name
            </label>
            <input
              name="brand_name"
              type="text"
              required
              placeholder="e.g. Carmel Coffee Co."
              className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
              Your Name (optional)
            </label>
            <input
              name="contact_name"
              type="text"
              placeholder="e.g. Jamie"
              className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
              Email
            </label>
            <input
              name="contact_email"
              type="email"
              required
              placeholder="you@business.com"
              className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
              Phone (optional)
            </label>
            <input
              name="contact_phone"
              type="tel"
              placeholder="(555) 555-5555"
              className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
            />
          </div>
        </div>

        {rateCards.length > 0 && (
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1.5">
              Interested in (select all that apply)
            </label>
            <div className="space-y-1.5">
              {rateCards.map((rate) => (
                <label
                  key={rate.id}
                  className="flex items-center justify-between gap-2 bg-black/20 border border-white/10 rounded-md px-2.5 py-2 cursor-pointer hover:border-amber/30 transition-colors"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rate.id)}
                      onChange={() => toggleRateCard(rate.id)}
                      className="w-3.5 h-3.5 accent-amber flex-shrink-0"
                    />
                    <span className="text-xs text-chalk truncate">
                      {rate.deliverable_type}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-amber flex-shrink-0">
                    {formatPrice(rate.price)}
                  </span>
                </label>
              ))}
            </div>
            {selectedIds.length === 0 && (
              <p className="text-[10px] text-chalk/30 mt-1.5">
                Leave unselected for a general inquiry.
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={3}
            placeholder={`Tell ${athleteName}'s family a bit about your business and what you have in mind...`}
            className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 bg-white/5 text-chalk/60 font-semibold text-sm py-2.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-amber text-turf font-bold text-sm py-2.5 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Send Inquiry
          </button>
        </div>
      </form>
    </div>
  );
}
