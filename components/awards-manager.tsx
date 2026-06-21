'use client';

import { useState } from 'react';
import { addAward, deleteAward } from '@/lib/actions/awards';

interface Award {
  id: string;
  title: string;
}

interface AwardsManagerProps {
  athleteId: string | null;
  initialAwards: Award[];
}

export function AwardsManager({ athleteId, initialAwards }: AwardsManagerProps) {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [newTitle, setNewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    setError(null);

    if (!athleteId) {
      setError('Save your profile once first, then add awards.');
      return;
    }

    if (!newTitle.trim()) return;

    setSubmitting(true);
    const result = await addAward(newTitle);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setAwards((prev) => [...prev, { id: `temp-${Date.now()}`, title: newTitle.trim() }]);
    setNewTitle('');
  }

  async function handleDelete(id: string) {
    setError(null);
    const result = await deleteAward(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setAwards((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-3">
      {awards.length > 0 && (
        <ul className="space-y-2">
          {awards.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 bg-black/15 border border-white/5 rounded-lg px-4 py-2.5"
            >
              <span className="text-sm text-chalk">{a.title}</span>
              <button
                type="button"
                onClick={() => handleDelete(a.id)}
                className="text-[11px] font-semibold text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="e.g. All-Conference 2025"
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !newTitle.trim()}
          className="bg-white/5 text-chalk font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          Add
        </button>
      </div>

      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
