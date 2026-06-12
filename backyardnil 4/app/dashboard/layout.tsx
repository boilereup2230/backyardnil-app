import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/lib/actions/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-white/5 bg-turf-mid/50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-display font-bold text-xl tracking-wide text-chalk">
            Backyard<span className="text-amber">NIL</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-chalk/40 hidden sm:inline">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs font-semibold text-chalk/50 hover:text-chalk transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
}
