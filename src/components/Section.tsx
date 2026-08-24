import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold dark:border-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}
