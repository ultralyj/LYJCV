import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const LINK_LABELS: { key: keyof Project['links']; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'report', label: 'Report' },
  { key: 'demo', label: 'Demo' },
];

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, thumbnail, links } = project;
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
        <div className="text-slate-700 dark:text-slate-300">{description}</div>
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
