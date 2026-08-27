import type { ReactNode } from 'react';
import type { CustomSection } from '../types';
import { Section } from './Section';
import { withBase } from '../utils/asset';

interface CustomSectionsProps {
  sections: CustomSection[];
}

export function CustomSections({ sections }: CustomSectionsProps) {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          {section.layout === 'cards' && <CardLayout items={section.items} />}
          {section.layout === 'list' && <ListLayout items={section.items} />}
          {section.layout === 'paragraph' && <ParagraphLayout items={section.items} />}
        </Section>
      ))}
    </>
  );
}

function CardLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const body = (
          <>
            {item.thumbnail && (
              <img
                src={withBase(item.thumbnail!)}
                alt={item.title ?? ''}
                loading="lazy"
                className="mb-2 h-28 w-full rounded object-cover"
              />
            )}
            {item.title && <div className="custom-card-title">{item.title}</div>}
            {item.description && (
              <div className="custom-card-desc">{item.description}</div>
            )}
          </>
        );
        const cls = 'custom-card';
        return item.href ? (
          <a
            key={i}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={cls}
          >
            {body}
          </a>
        ) : (
          <div key={i} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

function ListLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <ul className="custom-list">
      {items.map((item, i) => {
        const isExternal = item.href?.startsWith('http');
        const linkProps = item.href
          ? {
              href: item.href,
              target: isExternal ? ('_blank' as const) : undefined,
              rel: isExternal ? 'noopener noreferrer' : undefined,
            }
          : null;
        let titleNode: ReactNode = null;
        if (item.title) {
          titleNode = linkProps ? (
            <a {...linkProps} className="prose-link">
              {item.title}
            </a>
          ) : (
            <span className="font-medium">{item.title}</span>
          );
        }
        let descriptionNode: React.ReactNode = null;
        if (item.description) {
          descriptionNode =
            !item.title && linkProps ? (
              <a {...linkProps} className="prose-link">
                {item.description}
              </a>
            ) : (
              <span>{item.description}</span>
            );
        }
        return (
          <li key={i}>
            {titleNode}
            {item.title && item.description && ' — '}
            {descriptionNode}
          </li>
        );
      })}
    </ul>
  );
}

function ParagraphLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {items.map((item, i) => (
        <p key={i}>{item.description}</p>
      ))}
    </div>
  );
}
