import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-chalk/50 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors"
        {...props}
      />
    </div>
  );
}
