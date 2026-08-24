import type { Publication } from '../types';

interface PublicationCardProps {
  publication: Publication;
  ownName: string;
}

const LINK_LABELS: { key: keyof Publication['links']; label: string }[] = [
  { key: 'paper', label: 'Paper' },
  { key: 'code', label: 'Code' },
  { key: 'project', label: 'Project' },
  { key: 'dataset', label: 'Dataset' },
];

export function PublicationCard({ publication, ownName }: PublicationCardProps) {
  const { title, authors, venue, tags, thumbnail, links } = publication;

  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          loading="lazy"
          className="h-24 w-36 shrink-0 rounded object-cover"
        />
      )}
      <div className="text-sm leading-relaxed">
        <div className="font-semibold">{title}</div>
        <div className="text-slate-700 dark:text-slate-300">
          {authors.map((a, i) => {
            const isOwn = a.trim().toLowerCase() === ownName.trim().toLowerCase();
            return (
              <span key={a + i}>
                {i > 0 && ', '}
                {isOwn ? <strong className="underline">{a}</strong> : a}
              </span>
            );
          })}
        </div>
        <div className="italic text-slate-600 dark:text-slate-400">{venue}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-accent dark:text-accent-dark">
          {LINK_LABELS.filter(({ key }) => links[key]).map(({ key, label }) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:underline"
            >
              [{label}]
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
