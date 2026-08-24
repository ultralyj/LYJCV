import type { NewsItem } from '../types';
import { useCollapsible } from '../hooks/useCollapsible';
import { Section } from './Section';

interface NewsProps {
  items: NewsItem[];
}

const INITIAL_VISIBLE = 4;

export function News({ items }: NewsProps) {
  const { expanded, visibleCount, toggle } = useCollapsible(items.length, INITIAL_VISIBLE);
  const visible = items.slice(0, visibleCount);

  return (
    <Section id="news" title="News">
      <ul className="space-y-1.5 leading-relaxed">
        {visible.map((item, i) => (
          <li key={`${item.date}-${i}`} className="text-sm">
            <span className="mr-2 font-semibold">[{item.date}]</span>
            {item.content}
          </li>
        ))}
      </ul>
      {items.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={toggle}
          className="mt-2 text-sm text-accent hover:underline dark:text-accent-dark"
        >
          {expanded ? 'Show less ▴' : `Show more ▾ (${items.length - INITIAL_VISIBLE})`}
        </button>
      )}
    </Section>
  );
}
