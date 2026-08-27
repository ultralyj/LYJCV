import type { NoteLink } from '../types';
import { Section } from './Section';

interface NotesProps {
  notes: NoteLink[];
}

export function Notes({ notes }: NotesProps) {
  return (
    <Section id="notes" title="Others">
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.href}>
            <a
              href={note.href}
              target="_blank"
              rel="noopener noreferrer"
              className="prose-link"
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
