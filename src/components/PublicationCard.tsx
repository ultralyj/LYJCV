import type { Publication, PublicationLinkKind } from '../types';

interface PublicationCardProps {
  publication: Publication;
}

const LINK_LABELS: Record<PublicationLinkKind, string> = {
  paper: 'paper',
  code: 'code',
  project: 'project page',
  twitter: 'X',
  dataset: 'dataset',
  demo: 'demo',
  report: 'report',
  generic: 'link',
};

export function PublicationCard({ publication }: PublicationCardProps) {
  const {
    title,
    authors,
    venue,
    tags,
    selected,
    honor,
    thumbnail,
    links,
    note,
    abstract,
  } = publication;

  return (
    <article
      className={`paper-row${selected ? ' paper-row-selected' : ''}`}
    >
      <div className="paper-media-cell">
        {thumbnail && (
          <div className="paper-media-stack">
            <div className="paper-media-figure">
              <img
                src={thumbnail}
                alt={`${title} teaser`}
                loading="lazy"
                width={160}
              />
            </div>
            {tags.length > 0 && (
              <div className="paper-tags-overlay">
                {tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`paper-tag paper-tag-${tag.category}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {selected && <span className="selected-badge">Selected</span>}
      </div>
      <div className="paper-content-cell">
        <div className="paper-venue">
          <em className={`venue-${venue.type}`}>{venue.name}</em>
          {honor && (
            <span
              className={`paper-honor${
                honor === 'best' ? ' paper-honor-best' : ''
              }`}
            >
              {honor === 'best' ? 'Best Paper' : 'Oral'}
            </span>
          )}
        </div>
        <h3 className="paper-title">
          {links[0]?.kind === 'paper' && links[0]?.href ? (
            <a href={links[0].href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <div className="paper-authors">
          {authors.map((author, i) => {
            const sep = i < authors.length - 1 ? ', ' : '';
            const marker = author.equalContrib ? (
              <sup className="author-marker">*</sup>
            ) : author.corresponding ? (
              <sup className="author-marker">#</sup>
            ) : null;
            const content = (
              <>
                {author.isOwn ? <b>{author.name}</b> : author.name}
                {marker}
                {sep}
              </>
            );
            return author.url ? (
              <a
                key={author.name + i}
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <span key={author.name + i}>{content}</span>
            );
          })}
        </div>
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
            {note && <span className="paper-link-note">{note}</span>}
          </div>
        )}
        {abstract && <p className="paper-abstract">{abstract}</p>}
      </div>
    </article>
  );
}
