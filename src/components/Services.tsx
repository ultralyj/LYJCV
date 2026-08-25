import type { ServiceGroup } from '../types';
import { Section } from './Section';

interface ServicesProps {
  groups: ServiceGroup[];
}

export function Services({ groups }: ServicesProps) {
  return (
    <Section id="services" title="Academic Services">
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              {group.heading}
            </h3>
            <ul className="services-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
