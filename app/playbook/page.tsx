'use client';

import { useState } from 'react';
import Link from 'next/link';

const steps = {
  brands: [
    {
      title: 'Discover local athletes',
      body: 'Browse high school athletes by sport, school, or state to find names that matter in your community.',
    },
    {
      title: 'Review their rate card',
      body: 'See social reach, engagement, and pricing for posts, shoutouts, appearances, and more — all in one place.',
    },
    {
      title: 'Send an inquiry',
      body: 'Reach out directly. The athlete or their parent responds, and you work out the partnership together.',
    },
  ],
  athletes: [
    {
      title: 'Create your profile',
      body: 'Add your sport, school, social handles, and a short bio so brands can find and get to know you.',
    },
    {
      title: 'Set your rate card',
      body: "We'll suggest starting prices based on your following and engagement — adjust anything to fit you.",
    },
    {
      title: 'Get discovered',
      body: 'Publish your profile and local brands can find you, review your rates, and reach out to partner.',
    },
  ],
};

const testimonials = [
  {
    quote:
      "We sponsored a post from our local quarterback for less than a single Facebook ad — and got way more engagement from people who actually live here.",
    name: 'Local brand, coming soon',
    role: 'Small business owner',
  },
  {
    quote:
      "My daughter posts about sports anyway. Now a few local businesses pay her for it, and she's learning how to run her own little business.",
    name: 'Athlete family, coming soon',
    role: 'Parent',
  },
];

const faqs = [
  {
    q: 'What is BackyardNIL?',
    a: 'BackyardNIL is a marketplace that connects local brands and businesses with high school athletes for name, image, and likeness (NIL) partnerships — things like social media shoutouts, appearances, and product reviews.',
  },
  {
    q: 'Is this legal? What about NIL compliance for high schoolers?',
    a: "NIL rules vary by state, and we built compliance checks into every athlete profile based on their state's current rules. Each profile shows a compliance status so brands and families know where things stand. We always recommend checking with your state athletic association for the latest guidance.",
  },
  {
    q: 'How much does it cost to use?',
    a: 'Creating a profile and browsing athletes is free. Pricing for any future premium features will always be clearly listed — there are no hidden fees for using the core marketplace.',
  },
  {
    q: 'How do payments work?',
    a: "Right now, brands and athletes/families connect directly through inquiries and arrange payment between themselves. We're working on more built-in tools for this in the future.",
  },
  {
    q: 'What can a brand actually get from an athlete?',
    a: 'Each athlete sets their own rate card — common deliverables include Instagram posts, stories, and reels, TikTok videos, X (Twitter) posts, game day shoutouts, in-person appearances, autograph signings, and product reviews.',
  },
  {
    q: 'How are suggested rates calculated?',
    a: "We generate a starting rate card based on the athlete's combined social following, engagement rate, and sport — giving even smaller or newer accounts a reasonable starting price. Athletes and families can adjust every price before publishing.",
  },
  {
    q: 'Who can sign up?',
    a: 'Any high school athlete, in any sport or activity, in any state, can create a profile. Parents or guardians can co-sign and manage profiles for minors.',
  },
  {
    q: 'How do I get started?',
    a: "Athletes and families can create a free account and build a profile in a few minutes. Brands can browse athlete profiles right away — no account needed to look around.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-grass border border-white/5 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
      >
        <span className="text-sm font-semibold text-chalk">{q}</span>
        <span className="text-amber text-lg flex-shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs text-chalk/55 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PlaybookPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">
      {/* ─── Hero ─── */}
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-wide text-chalk mb-4">
          Local brands. <span className="text-amber">Local legends.</span>
        </h1>
        <p className="text-chalk/60 text-sm max-w-lg mx-auto leading-relaxed">
          BackyardNIL connects local businesses with the high school athletes
          their community already follows — turning hometown pride into real
          opportunity for both sides.
        </p>
      </div>

      {/* ─── Video placeholder ─── */}
      <div className="mb-14 aspect-video bg-black/20 border border-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-chalk/40 text-sm font-semibold mb-1">
            Demo video coming soon
          </div>
          <div className="text-chalk/25 text-xs">
            See BackyardNIL in action
          </div>
        </div>
      </div>

      {/* ─── For Brands ─── */}
      <section className="mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber mb-5">
          For Brands
        </h2>
        <div className="space-y-3">
          {steps.brands.map((step, i) => (
            <div
              key={step.title}
              className="bg-grass border border-white/5 rounded-xl p-5 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber/15 text-amber font-display font-bold flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-chalk mb-1">
                  {step.title}
                </div>
                <p className="text-xs text-chalk/50 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-amber/10 border border-amber/15 rounded-xl p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-amber mb-2">
            Why it works for your business
          </div>
          <p className="text-xs text-chalk/60 leading-relaxed">
            Hyper-local reach at a fraction of typical ad rates, with
            built-in community goodwill. Sponsoring an athlete from down the
            street resonates differently than a billboard — your brand
            becomes part of the local story.
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/discover"
            className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Browse Athletes
          </Link>
        </div>
      </section>

      {/* ─── For Athletes & Families ─── */}
      <section className="mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber mb-5">
          For Athletes &amp; Families
        </h2>
        <div className="space-y-3">
          {steps.athletes.map((step, i) => (
            <div
              key={step.title}
              className="bg-grass border border-white/5 rounded-xl p-5 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber/15 text-amber font-display font-bold flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-chalk mb-1">
                  {step.title}
                </div>
                <p className="text-xs text-chalk/50 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-amber/10 border border-amber/15 rounded-xl p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-amber mb-2">
            Your hustle, your brand
          </div>
          <p className="text-xs text-chalk/60 leading-relaxed">
            You're already putting in the work — practices, games, building a
            following. BackyardNIL helps you turn that into real
            opportunities with brands in your own community, on your terms.
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber mb-5">
          What People Are Saying
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-grass border border-white/5 rounded-xl p-5"
            >
              <p className="text-sm text-chalk/70 leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="text-xs font-semibold text-chalk/40">
                {t.name}
              </div>
              <div className="text-[11px] text-chalk/30">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="text-center bg-amber/10 border border-amber/15 rounded-xl p-8">
        <h2 className="font-display font-bold text-2xl tracking-wide text-chalk mb-2">
          Ready to get started?
        </h2>
        <p className="text-chalk/60 text-sm mb-6 max-w-sm mx-auto">
          Whether you&apos;re a brand looking for local reach or an athlete
          ready to build your own, BackyardNIL is the place to start.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/discover"
            className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Browse Athletes
          </Link>
          <Link
            href="/login"
            className="inline-block bg-white/5 text-chalk font-bold text-sm px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Athlete &amp; Family Login
          </Link>
        </div>
      </section>
    </main>
  );
}
