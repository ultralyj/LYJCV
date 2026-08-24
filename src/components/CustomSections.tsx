import type { CustomSection } from '../types';
import { Section } from './Section';

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
                src={item.thumbnail}
                alt={item.title ?? ''}
                loading="lazy"
                className="mb-2 h-28 w-full rounded object-cover"
              />
            )}
            {item.title && <div className="font-semibold">{item.title}</div>}
            {item.description && (
              <div className="text-sm text-slate-600 dark:text-slate-300">{item.description}</div>
            )}
          </>
        );
        const cls =
          'block rounded border border-slate-200 p-3 hover:shadow-sm dark:border-slate-700';
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
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
      {items.map((item, i) => (
        <li key={i}>
          {item.title && <span className="font-medium">{item.title}</span>}
          {item.title && item.description && ' — '}
          {item.description && <span>{item.description}</span>}
        </li>
      ))}
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
