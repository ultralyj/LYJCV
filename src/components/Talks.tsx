import type { Talk } from '../types';
import { Section } from './Section';

interface TalksProps {
  talks: Talk[];
}

export function Talks({ talks }: TalksProps) {
  return (
    <Section id="talks" title="Talks">
      <ul className="space-y-2 text-sm">
        {talks.map((talk) => (
          <li key={talk.date + talk.title}>
            <span className="mr-2 font-semibold">[{talk.date}]</span>
            <span className="font-medium">{talk.title}</span>
            <span className="text-slate-600 dark:text-slate-400"> — {talk.host}</span>
            {talk.replay && (
              <a
                href={talk.replay}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-accent hover:underline dark:text-accent-dark"
              >
                [replay]
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
