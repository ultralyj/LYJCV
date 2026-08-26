import type { Project, ProjectLinkKind } from '../types';
import { withBase } from '../utils/asset';

interface ProjectCardProps {
  project: Project;
}

const LINK_LABELS: Record<ProjectLinkKind, string> = {
  code: 'code',
  report: 'report',
  demo: 'demo',
  project: 'project page',
  generic: 'link',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, thumbnail, links } = project;
  return (
    <article className="paper-row">
      <div className="paper-media-cell">
        {thumbnail && (
          <div className="paper-media-stack">
            <div className="paper-media-figure">
              <img
                src={withBase(thumbnail)}
                alt={`${title} teaser`}
                loading="lazy"
                width={160}
              />
            </div>
          </div>
        )}
      </div>
      <div className="paper-content-cell">
        <h3 className="paper-title">{title}</h3>
        {links.length > 0 && (
          <div className="paper-links">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`paper-link paper-link-${link.kind}`}
              >
                {link.label ?? LINK_LABELS[link.kind]}
              </a>
            ))}
          </div>
        )}
        <p className="paper-abstract">{description}</p>
      </div>
    </article>
  );
}
