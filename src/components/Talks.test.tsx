import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Talks } from './Talks';
import type { Talk } from '../types';

const talks: Talk[] = [
  { date: '2026-03', title: 'A Talk', host: 'MIT', hostUrl: 'https://mit.edu', replay: '/r' },
  { date: '2025-10', title: 'No Link Talk', host: 'Workshop' },
];

describe('Talks', () => {
  it('renders bold date, title, linked host and replay link', () => {
    render(<Talks talks={talks} />);
    expect(screen.getByText('[2026-03]')).toHaveClass('talk-date');
    expect(screen.getByText('A Talk')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MIT' })).toHaveAttribute(
      'href',
      'https://mit.edu',
    );
    expect(screen.getByRole('link', { name: '[replay]' })).toBeInTheDocument();

    expect(screen.getByText('No Link Talk')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Workshop' })).not.toBeInTheDocument();
    const workshopItem = screen.getByText(/Workshop/).closest('li');
    expect(workshopItem).not.toBeNull();
    expect(
      within(workshopItem as HTMLElement).queryByRole('link'),
    ).not.toBeInTheDocument();
  });
});
