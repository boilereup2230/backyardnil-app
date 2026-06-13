import Link from "next/link";
export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-bold text-5xl tracking-wide text-chalk mb-4">
          Backyard<span className="text-amber">NIL</span>
        </h1>
        <p className="text-chalk/60 text-sm mb-8">
          Where local brands meet local legends. App scaffold — athlete
          profile + rate card MVP.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <Link
            href="/playbook"
            className="inline-block bg-amber text-turf font-bold text-sm px-6 py-3 rounded-lg hover:bg-amber-dim transition-colors"
          >
            See It In Action
          </Link>
          <Link
            href="/discover"
            className="inline-block bg-white/5 text-chalk font-bold text-sm px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Browse Athletes
          </Link>
        </div>
        <Link
          href="/login"
          className="inline-block text-xs font-semibold text-chalk/40 hover:text-chalk transition-colors"
        >
          Athlete &amp; Family Login →
        </Link>
      </div>
    </main>
  );
}
