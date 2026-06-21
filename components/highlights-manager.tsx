'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { addHighlight, deleteHighlight } from '@/lib/actions/highlights';

interface Highlight {
  id: string;
  media_type: 'photo' | 'video';
  media_url: string;
  caption: string | null;
}

interface HighlightsManagerProps {
  athleteId: string | null;
  initialHighlights: Highlight[];
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export function HighlightsManager({ athleteId, initialHighlights }: HighlightsManagerProps) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasVideo = highlights.some((h) => h.media_type === 'video');
  const atLimit = highlights.length >= 6;

  async function handleUpload(file: File, mediaType: 'photo' | 'video') {
    setError(null);

    if (!athleteId) {
      setError('Save your profile once first, then add highlights.');
      return;
    }

    const acceptedTypes = mediaType === 'photo' ? ACCEPTED_PHOTO_TYPES : ACCEPTED_VIDEO_TYPES;
    const maxSize = mediaType === 'photo' ? MAX_PHOTO_SIZE : MAX_VIDEO_SIZE;

    if (!acceptedTypes.includes(file.type)) {
      setError(
        mediaType === 'photo'
          ? 'Please choose a JPG, PNG, or WEBP image.'
          : 'Please choose an MP4, MOV, or WEBM video.'
      );
      return;
    }

    if (file.size > maxSize) {
      setError(`File must be under ${mediaType === 'photo' ? '5MB' : '50MB'}.`);
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to upload.');
        setUploading(false);
        return;
      }

      const ext = file.name.split('.').pop();
      const path = `${user.id}/${mediaType}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete-highlights')
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('athlete-highlights')
        .getPublicUrl(path);

      const result = await addHighlight({
        mediaType,
        mediaUrl: publicUrlData.publicUrl,
      });

      if (result.error) {
        setError(result.error);
        setUploading(false);
        return;
      }

      // Optimistically add to local state (id is a placeholder until next
      // full page load/revalidation gives us the real one)
      setHighlights((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          media_type: mediaType,
          media_url: publicUrlData.publicUrl,
          caption: null,
        },
      ]);
    } catch (err) {
      setError('Something went wrong uploading your file.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    const result = await deleteHighlight(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    setActiveHighlight(null);
  }

  return (
    <div className="space-y-4">
      {highlights.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {highlights.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActiveHighlight(h)}
              className="relative aspect-square bg-black/20 border border-white/10 rounded-lg overflow-hidden group cursor-pointer"
            >
              {h.media_type === 'photo' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={h.media_url}
                  alt={h.caption ?? 'Highlight'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    src={h.media_url}
                    className="w-full h-full object-cover pointer-events-none"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center">
                      <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-chalk ml-0.5" />
                    </div>
                  </div>
                </>
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(h.id);
                }}
                role="button"
                tabIndex={0}
                className="absolute top-1.5 right-1.5 bg-black/70 text-chalk text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors z-10"
                title="Remove"
              >
                ×
              </span>
              {h.media_type === 'video' && (
                <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-chalk text-[10px] font-bold px-1.5 py-0.5 rounded">
                  VIDEO
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file, 'photo');
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploading || atLimit}
          className="bg-white/5 text-chalk font-bold text-xs px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
        >
          {uploading ? 'Uploading...' : '+ Add Photo'}
        </button>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file, 'video');
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={uploading || atLimit || hasVideo}
          className="bg-white/5 text-chalk font-bold text-xs px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
          title={hasVideo ? 'Only 1 video allowed' : undefined}
        >
          + Add Video
        </button>
      </div>

      {error && <p className="text-[11px] text-red-400">{error}</p>}
      <p className="text-[11px] text-chalk/35">
        Up to 6 items total, max 1 video. {highlights.length}/6 used.
      </p>

      {/* ─── Lightbox ─── */}
      {activeHighlight && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6"
          onClick={() => setActiveHighlight(null)}
        >
          <button
            type="button"
            onClick={() => setActiveHighlight(null)}
            className="absolute top-5 right-5 text-chalk/70 hover:text-chalk text-2xl leading-none w-10 h-10 flex items-center justify-center"
            title="Close"
          >
            ×
          </button>

          <div
            className="max-w-2xl w-full max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeHighlight.media_type === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeHighlight.media_url}
                alt={activeHighlight.caption ?? 'Highlight'}
                className="max-w-full max-h-[80vh] rounded-lg object-contain"
              />
            ) : (
              <video
                src={activeHighlight.media_url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
