import type { ServiceGroup } from '../types';
import { Section } from './Section';
import { withBase } from '../utils/asset';

interface ServicesProps {
  groups: ServiceGroup[];
}

export function Services({ groups }: ServicesProps) {
  const robotUrl = withBase('/robot.svg');
  return (
    <Section id="services" title="Academic Services">
      <div
        className="section-deco"
        aria-hidden="true"
        style={{
          WebkitMaskImage: `url(${robotUrl})`,
          maskImage: `url(${robotUrl})`,
        }}
      />
      <div className="section-deco-content">
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="services-heading">{group.heading}</h3>
            <ul className="services-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </div>
    </Section>
  );
}
