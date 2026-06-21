'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PhotoUploadProps {
  athleteId: string | null;
  currentPhotoUrl: string | null;
  onUploaded: (url: string) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function PhotoUpload({ athleteId, currentPhotoUrl, onUploaded }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be under 5MB.');
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    if (!athleteId) {
      setError('Save your profile once first, then add a photo.');
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to upload a photo.');
        setUploading(false);
        return;
      }

      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete-photos')
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('athlete-photos')
        .getPublicUrl(path);

      // Cache-bust so the new image shows immediately even with the same filename
      const finalUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      onUploaded(finalUrl);
      setPreviewUrl(finalUrl);
    } catch (err) {
      setError('Something went wrong uploading your photo.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-black/20 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-chalk/30 text-xs">No photo</span>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-white/5 text-chalk font-bold text-xs px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : previewUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}
        {!error && (
          <p className="text-[11px] text-chalk/35 mt-1.5">
            JPG, PNG, or WEBP. Max 5MB.
          </p>
        )}
      </div>
    </div>
  );
}
