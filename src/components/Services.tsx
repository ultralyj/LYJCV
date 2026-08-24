import type { ServiceGroup } from '../types';
import { Section } from './Section';

interface ServicesProps {
  groups: ServiceGroup[];
}

export function Services({ groups }: ServicesProps) {
  return (
    <Section id="services" title="Academic Services">
      <div className="grid gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-2 text-sm font-semibold">{group.heading}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
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
