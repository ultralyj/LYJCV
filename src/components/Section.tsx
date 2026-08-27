import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="site-section">
      <div className="site-section-body">
        <h2 id={`${id}-heading`} className="section-heading">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
