import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  /** Render the heading inside a gradient "head" row (used by tables). */
  head?: boolean;
}

export function Section({ id, title, children, head = false }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="site-section">
      {head ? (
        <div className="site-section-head">
          <h2 id={`${id}-heading`} className="section-heading">
            {title}
          </h2>
          {children}
        </div>
      ) : (
        <div className="site-section-body">
          <h2 id={`${id}-heading`} className="section-heading">
            {title}
          </h2>
          {children}
        </div>
      )}
    </section>
  );
}
