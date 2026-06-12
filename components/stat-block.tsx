interface StatBlockProps {
  value: string;
  label: string;
}

export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className="bg-grass/40 rounded-lg px-2 py-3 text-center">
      <div className="font-display font-bold text-2xl leading-none text-chalk mb-1">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-chalk/40">
        {label}
      </div>
    </div>
  );
}
