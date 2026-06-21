import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/lib/actions/auth';

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-white/5 bg-turf-mid/50">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display font-bold text-xl tracking-wide text-chalk flex-shrink-0"
        >
          Backyard<span className="text-amber">NIL</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-5">
          <Link
            href="/discover"
            className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/playbook"
            className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
          >
            Playbook
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4 flex-shrink-0">
          {user ? (
            <>
              <span className="text-xs text-chalk/40 hidden md:inline">
                {user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
