import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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
    <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      {children}
    </main>
  );
}
