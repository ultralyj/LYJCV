import type { NewsItem } from '../types';
import { useCollapsible } from '../hooks/useCollapsible';
import { Section } from './Section';

interface NewsProps {
  items: NewsItem[];
}

const INITIAL_VISIBLE = 5;

export function News({ items }: NewsProps) {
  const { expanded, visibleCount, toggle } = useCollapsible(
    items.length,
    INITIAL_VISIBLE,
  );
  const visible = items.slice(0, visibleCount);
  const hasMore = items.length > INITIAL_VISIBLE;

  return (
    <Section id="news" title="News">
      <ul
        className="news-list"
        data-collapsed={hasMore && !expanded ? 'true' : 'false'}
      >
        {visible.map((item, i) => {
          const isLastVisible = hasMore && !expanded && i === visible.length - 1;
          return (
            <li
              key={`${item.date}-${i}`}
              className={[
                hasMore && !expanded && i >= INITIAL_VISIBLE
                  ? 'is-news-collapsed'
                  : '',
                isLastVisible ? 'is-news-last-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="news-date">{item.date}</span>
              <span
                className="news-body"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          className="news-toggle"
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="news-toggle-label">
            {expanded ? 'Show less' : 'Show earlier news'}
          </span>
          <svg
            className="news-toggle-chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </Section>
  );
}
