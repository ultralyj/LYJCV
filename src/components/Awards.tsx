import type { Award } from '../types';
import { Section } from './Section';

interface AwardsProps {
  awards: Award[];
}

export function Awards({ awards }: AwardsProps) {
  return (
    <Section id="awards" title="Selected Awards">
      <div className="award-grid">
        {awards.map((a) => {
          const prize = a.href ? (
            <a
              className="award-prize"
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {a.prize}
            </a>
          ) : (
            <span className="award-prize">{a.prize}</span>
          );
          return (
            <article
              key={`${a.year}-${a.competition}`}
              className="award-card"
            >
              <div className="award-card-top">
                {prize}
                <span className="award-year">{a.year}</span>
              </div>
              <span className="award-competition">{a.competition}</span>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
