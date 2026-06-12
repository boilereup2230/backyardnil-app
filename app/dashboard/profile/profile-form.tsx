'use client';

import { useState } from 'react';
import { saveProfile } from '@/lib/actions/profile';
import { FormField } from '@/components/form-field';
import { FormTextarea } from '@/components/form-textarea';
import { SportSelect } from '@/components/sport-select';
import { US_STATES } from '@/lib/data/states';
import type { AthleteProfile } from '@/lib/types';

const selectClasses =
  'w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk ' +
  'focus:outline-none focus:border-amber transition-colors appearance-none';

export function ProfileForm({ profile }: { profile: AthleteProfile | null }) {
  const [sport, setSport] = useState(profile?.sport ?? '');

  return (
    <form action={saveProfile} className="space-y-8">
      {profile && (
        <input type="hidden" name="athlete_id" value={profile.id} />
      )}

      {/* ─── Identity ─── */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber">
          Athlete Info
        </h2>

        <FormField
          label="Athlete Name"
          id="athlete_name"
          name="athlete_name"
          type="text"
          placeholder="e.g. Marcus Webb"
          defaultValue={profile?.athlete_name ?? ''}
          required
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sport"
              className="block text-xs font-semibold uppercase tracking-wider text-chalk/50 mb-1.5"
            >
              Sport / Activity
            </label>
            <SportSelect
              id="sport"
              name="sport"
              defaultValue={profile?.sport ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSport(e.target.value)
              }
            />
          </div>

          <FormField
            label="Position (optional)"
            id="position"
            name="position"
            type="text"
            placeholder="e.g. Wide Receiver"
            defaultValue={profile?.position ?? ''}
          />
        </div>

        {sport === 'Other' && (
          <FormField
            label="Tell us what sport/activity"
            id="sport_other"
            name="sport_other"
            type="text"
            placeholder="e.g. Equestrian"
            defaultValue={profile?.sport_other ?? ''}
            required
          />
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <FormField
            label="Grad Year"
            id="grad_year"
            name="grad_year"
            type="number"
            placeholder="2027"
            min={2024}
            max={2035}
            defaultValue={profile?.grad_year ?? ''}
          />

          <div className="sm:col-span-2">
            <FormField
              label="School Name"
              id="school_name"
              name="school_name"
              type="text"
              placeholder="e.g. Carmel High School"
              defaultValue={profile?.school_name ?? ''}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-xs font-semibold uppercase tracking-wider text-chalk/50 mb-1.5"
          >
            State
          </label>
          <select
            id="state"
            name="state"
            defaultValue={profile?.state ?? ''}
            required
            className={selectClasses}
          >
            <option value="" disabled>
              Select state
            </option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-chalk/35 mt-1.5">
            This determines which state NIL compliance rules apply to your athlete.
          </p>
        </div>

        <FormTextarea
          label="Bio (optional)"
          id="bio"
          name="bio"
          placeholder="A short intro for your athlete's profile — accomplishments, interests, etc."
          rows={3}
          defaultValue={profile?.bio ?? ''}
        />

        <FormField
          label="GPA (optional)"
          id="gpa"
          name="gpa"
          type="number"
          step="0.01"
          min={0}
          max={4}
          placeholder="3.92"
          defaultValue={profile?.gpa ?? ''}
          className="max-w-[140px]"
        />
      </section>

      {/* ─── Social ─── */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber">
          Social Media
        </h2>
        <p className="text-xs text-chalk/40 -mt-2">
          Manually enter your follower counts for now — these display on
          your profile alongside your rate card.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Instagram Handle"
            id="instagram_handle"
            name="instagram_handle"
            type="text"
            placeholder="@username"
            defaultValue={profile?.instagram_handle ?? ''}
          />
          <FormField
            label="Instagram Followers"
            id="instagram_followers"
            name="instagram_followers"
            type="number"
            min={0}
            placeholder="12400"
            defaultValue={profile?.instagram_followers ?? ''}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="TikTok Handle"
            id="tiktok_handle"
            name="tiktok_handle"
            type="text"
            placeholder="@username"
            defaultValue={profile?.tiktok_handle ?? ''}
          />
          <FormField
            label="TikTok Followers"
            id="tiktok_followers"
            name="tiktok_followers"
            type="number"
            min={0}
            placeholder="8200"
            defaultValue={profile?.tiktok_followers ?? ''}
          />
        </div>
      </section>

      {/* ─── Visibility ─── */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber">
          Visibility
        </h2>

        <label className="flex items-start gap-3 bg-black/20 border border-white/10 rounded-lg px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={profile?.is_published ?? false}
            className="mt-0.5 w-4 h-4 accent-amber"
          />
          <div>
            <div className="text-sm font-semibold text-chalk">
              Publish this profile
            </div>
            <div className="text-xs text-chalk/40 mt-0.5">
              When enabled, your athlete&apos;s profile is publicly viewable
              and discoverable by brands.
            </div>
          </div>
        </label>
      </section>

      <button
        type="submit"
        className="w-full bg-amber text-turf font-bold text-sm py-3 rounded-lg hover:bg-amber-dim transition-colors"
      >
        Save Profile
      </button>
    </form>
  );
}
