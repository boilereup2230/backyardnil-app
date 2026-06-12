import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextarea({ label, id, ...props }: FormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-chalk/50 mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={id}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/25 focus:outline-none focus:border-amber transition-colors resize-none"
        {...props}
      />
    </div>
  );
}
