import type { NewsItem } from '../types';
import { useCollapsible } from '../hooks/useCollapsible';
import { Section } from './Section';
import { withBase } from '../utils/asset';

interface NewsProps {
  items: NewsItem[];
}

const INITIAL_VISIBLE = 3;

export function News({ items }: NewsProps) {
  const { expanded, toggle } = useCollapsible(
    items.length,
    INITIAL_VISIBLE,
  );
  const hasMore = items.length > INITIAL_VISIBLE;

  const robotUrl = withBase('/robot2.svg');

  return (
    <Section id="news" title="News">
      <div
        className="section-deco section-deco--news"
        aria-hidden="true"
        style={{
          WebkitMaskImage: `url(${robotUrl})`,
          maskImage: `url(${robotUrl})`,
        }}
      />
      <div className="section-deco-content">
      <ul
        className="news-list"
        data-collapsed={hasMore && !expanded ? 'true' : 'false'}
      >
        {items.map((item, i) => {
          // All items stay in the DOM so the expand/collapse can animate via
          // CSS; collapsed ones are flattened to 0 height and removed from the
          // a11y tree (aria-hidden + inert).
          const collapsed = hasMore && !expanded && i >= INITIAL_VISIBLE;
          const isLastVisible =
            hasMore && !expanded && i === INITIAL_VISIBLE - 1;
          return (
            <li
              key={`${item.date}-${i}`}
              ref={(el) => {
                if (el) el.inert = collapsed;
              }}
              aria-hidden={collapsed || undefined}
              className={[
                collapsed ? 'is-news-collapsed' : '',
                isLastVisible ? 'is-news-last-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="news-item-inner">
                <div className="news-item-content">
                  <span className="news-date">{item.date}</span>
                  <span
                    className="news-body"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
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
            {expanded ? 'Show less' : 'Show more'}
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
      </div>
    </Section>
  );
}
