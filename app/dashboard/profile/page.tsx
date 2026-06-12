import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AthleteProfile } from '@/lib/types';
import { ProfileForm } from './profile-form';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  return (
    <div>
      <div className="mb-8">
        <div className="font-display font-bold text-3xl tracking-wide text-chalk">
          {profile ? 'Edit Profile' : 'Create Athlete Profile'}
        </div>
        <p className="text-chalk/50 text-sm mt-1">
          {profile
            ? 'Update your athlete\u2019s info below.'
            : 'This information appears on your athlete\u2019s public profile.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <ProfileForm profile={profile as AthleteProfile | null} />
    </div>
  );
}
