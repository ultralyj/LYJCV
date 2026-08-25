import type { Talk } from '../types';
import { Section } from './Section';

interface TalksProps {
  talks: Talk[];
}

export function Talks({ talks }: TalksProps) {
  return (
    <Section id="talks" title="Talks">
      <ul className="talks-list">
        {talks.map((talk) => (
          <li key={talk.date + talk.title}>
            <b className="talk-date">[{talk.date}]</b>{' '}
            <span className="font-medium">{talk.title}</span>
            {talk.hostUrl ? (
              <>
                {' — '}
                <a
                  href={talk.hostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prose-link"
                >
                  {talk.host}
                </a>
              </>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">
                {' — '}
                {talk.host}
              </span>
            )}
            {talk.replay && (
              <a
                href={talk.replay}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link ml-2"
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
