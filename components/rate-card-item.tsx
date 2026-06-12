import type { RateCard } from '@/lib/types';

interface RateCardItemProps {
  item: RateCard;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export function RateCardItem({ item }: RateCardItemProps) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-white/5 last:border-none">
      <div>
        <div className="text-sm text-chalk/80">{item.deliverable_type}</div>
        {item.description && (
          <div className="text-xs text-chalk/35 mt-0.5">{item.description}</div>
        )}
      </div>
      <div className="font-semibold text-sm text-amber whitespace-nowrap ml-4">
        {formatPrice(item.price)}
      </div>
    </div>
  );
}
