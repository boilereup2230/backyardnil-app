import { SPORT_GROUPS } from '@/lib/data/sports';
import type { ChangeEventHandler } from 'react';

interface SportSelectProps {
  name?: string;
  id?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

const baseClasses =
  'w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk ' +
  'focus:outline-none focus:border-amber transition-colors appearance-none';

export function SportSelect({
  name = 'sport',
  id = 'sport',
  defaultValue = '',
  required = true,
  className = '',
  onChange,
}: SportSelectProps) {
  return (
    <select
      name={name}
      id={id}
      defaultValue={defaultValue}
      required={required}
      onChange={onChange}
      className={`${baseClasses} ${className}`}
    >      <option value="" disabled>
        Select a sport or activity
      </option>
      {SPORT_GROUPS.map((group) => (
        <optgroup key={group.group} label={group.group}>
          {group.sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
