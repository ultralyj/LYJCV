import { useMemo, useState } from 'react';
import type { Publication, TagCategory } from '../types';
import { PublicationCard } from './PublicationCard';
import { PublicationsFilter, type FilterButton } from './PublicationsFilter';

interface PublicationsProps {
  publications: Publication[];
}

const CATEGORY_ORDER: TagCategory[] = [
  'policy',
  'manipulation',
  'tactile',
  'simulation',
  'other',
];

const ALL = 'all';
const SELECTED = 'selected';

export function Publications({ publications }: PublicationsProps) {
  const [active, setActive] = useState<string>(ALL);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      for (const tag of pub.tags) {
        counts.set(tag.label, (counts.get(tag.label) ?? 0) + 1);
      }
    }
    return counts;
  }, [publications]);

  const tagCategory = useMemo(() => {
    const map = new Map<string, TagCategory>();
    for (const pub of publications) {
      for (const tag of pub.tags) map.set(tag.label, tag.category);
    }
    return map;
  }, [publications]);

  const filterButtons: FilterButton[] = useMemo(() => {
    const selectedCount = publications.filter((p) => p.selected).length;
    const tagEntries = [...tagCounts.entries()].sort((a, b) => {
      const ca = tagCategory.get(a[0]);
      const cb = tagCategory.get(b[0]);
      const orderDiff =
        CATEGORY_ORDER.indexOf(ca as TagCategory) -
        CATEGORY_ORDER.indexOf(cb as TagCategory);
      if (orderDiff !== 0) return orderDiff;
      return a[0].localeCompare(b[0]);
    });
    return [
      { label: 'All', value: ALL, count: publications.length },
      ...(selectedCount > 0
        ? [
            {
              label: 'Selected',
              value: SELECTED,
              count: selectedCount,
              category: 'selected' as const,
            },
          ]
        : []),
      ...tagEntries.map(([label, count]) => ({
        label,
        value: label,
        count,
        category: tagCategory.get(label) as TagCategory,
      })),
    ];
  }, [publications, tagCounts, tagCategory]);

  const visible = useMemo(() => {
    if (active === ALL) return publications;
    if (active === SELECTED) return publications.filter((p) => p.selected);
    return publications.filter((p) => p.tags.some((t) => t.label === active));
  }, [publications, active]);

  return (
    <section
      id="publications"
      aria-labelledby="publications-heading"
      className="site-section"
    >
      <div className="site-section-head">
        <h2 id="publications-heading" className="section-heading">
          Publications
          <span
            className="pub-total-count"
            aria-label="total publications"
          >
            {publications.length}
          </span>
        </h2>
        <p className="publications-legend">
          * denotes equal contribution. # denotes corresponding author(s).
        </p>
        <PublicationsFilter
          buttons={filterButtons}
          value={active}
          onChange={setActive}
        />
      </div>
      <div className="paper-rows">
        {visible.map((pub) => (
          <PublicationCard key={pub.title} publication={pub} />
        ))}
      </div>
    </section>
  );
}
