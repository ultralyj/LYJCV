import { useMemo, useState } from 'react';
import type { Publication } from '../types';
import { PublicationCard } from './PublicationCard';
import { Section } from './Section';
import { TagFilter, type TagFilterTag } from './TagFilter';

interface PublicationsProps {
  publications: Publication[];
  ownName: string;
}

const ALL = 'all';
const SELECTED = '__selected__';

export function Publications({ publications, ownName }: PublicationsProps) {
  const [activeTag, setActiveTag] = useState<string>(ALL);
  const [selectedOnly, setSelectedOnly] = useState(false);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      for (const tag of pub.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  }, [publications]);

  const tags: TagFilterTag[] = useMemo(() => {
    const base: TagFilterTag[] = [
      { label: 'All', value: ALL, count: publications.length },
      ...[...tagCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ label: value, value, count })),
    ];
    const selectedCount = publications.filter((p) => p.selected).length;
    if (selectedCount > 0) {
      base.push({ label: '★ Selected', value: SELECTED, count: selectedCount });
    }
    return base;
  }, [publications, tagCounts]);

  const visible = useMemo(() => {
    return publications.filter((p) => {
      if (selectedOnly && !p.selected) return false;
      if (activeTag !== ALL && !p.tags.includes(activeTag)) return false;
      return true;
    });
  }, [publications, activeTag, selectedOnly]);

  const handleTagChange = (value: string) => {
    if (value === SELECTED) {
      setSelectedOnly((prev) => !prev);
    } else {
      setActiveTag(value);
    }
  };

  const activeValue = selectedOnly ? SELECTED : activeTag;

  return (
    <Section id="publications" title="Publications">
      <TagFilter tags={tags} value={activeValue} onChange={handleTagChange} />
      <p className="mb-3 text-xs text-slate-500">
        Showing {visible.length} of {publications.length}
      </p>
      <div>
        {visible.map((pub) => (
          <PublicationCard key={pub.title} publication={pub} ownName={ownName} />
        ))}
      </div>
    </Section>
  );
}
