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

export default function PlaybookPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl tracking-wide text-chalk mb-3">
          The <span className="text-amber">Playbook</span>
        </h1>
        <p className="text-chalk/60 text-sm max-w-md mx-auto">
          BackyardNIL connects local brands with local high school athletes.
          Here&apos;s how it works for both sides.
        </p>
      </div>

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

      <section>
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

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
