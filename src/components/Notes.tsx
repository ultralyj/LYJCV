import type { NoteLink } from '../types';
import { Section } from './Section';

interface NotesProps {
  notes: NoteLink[];
}

export function Notes({ notes }: NotesProps) {
  return (
    <Section id="notes" title="Course Notes">
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {notes.map((note) => (
          <li key={note.href}>
            <a
              href={note.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline dark:text-accent-dark"
            >
              {note.title}
            </a>
            {note.description && <span className="ml-2">— {note.description}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
