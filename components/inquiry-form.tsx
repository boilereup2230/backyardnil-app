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
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-chalk/40 mb-1">
              Interested in (optional)
            </label>
            <select
              name="rate_card_id"
              defaultValue=""
              className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-2 text-xs text-chalk focus:outline-none focus:border-amber transition-colors appearance-none"
            >
              <option value="">General inquiry</option>
              {rateCards.map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.deliverable_type} — {formatPrice(rate.price)}
                </option>
              ))}
            </select>
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
