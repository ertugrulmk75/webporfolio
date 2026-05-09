import type { TickerItem } from '@/types/sanity';

interface TickerProps {
  items: TickerItem[];
}

export function Ticker({ items }: TickerProps) {
  if (!items || items.length === 0) return null;
  const tripled = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {tripled.map((t, i) => (
          <span key={`${t._id}-${i}`} className="ticker-item">
            {t.text} <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
