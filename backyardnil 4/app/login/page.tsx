import Link from 'next/link';
import { login } from '@/lib/actions/auth';
import { FormField } from '@/components/form-field';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-3xl tracking-wide text-chalk">
            Backyard<span className="text-amber">NIL</span>
          </Link>
          <p className="text-chalk/50 text-sm mt-2">Welcome back</p>
        </div>

        <div className="bg-grass border border-amber/15 rounded-2xl p-6">
          {error && (
            <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form action={login} className="space-y-4">
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="w-full bg-amber text-turf font-bold text-sm py-3 rounded-lg hover:bg-amber-dim transition-colors"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-xs text-chalk/40 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-amber hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
