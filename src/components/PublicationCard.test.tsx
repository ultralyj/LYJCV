import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from './PublicationCard';
import type { Publication } from '../types';

const base: Publication = {
  title: 'A Tactile Paper',
  authors: [
    { name: 'Coauthor One' },
    { name: 'Your Name', isOwn: true, equalContrib: true },
    { name: 'Advisor', corresponding: true },
  ],
  venue: { name: 'CoRL 2026', type: 'conference' },
  tags: [
    { label: 'Tactile', category: 'manipulation' },
    { label: 'Manipulation', category: 'manipulation' },
  ],
  selected: true,
  honor: 'oral',
  thumbnail: '/img.jpg',
  links: [
    { kind: 'paper', href: '/paper.pdf' },
    { kind: 'code', href: '/code' },
  ],
  note: 'code coming soon',
  abstract: 'An abstract.',
};

describe('PublicationCard', () => {
  it('renders a selected row with badge, tags, venue pill, honor, authors, links and abstract', () => {
    render(<PublicationCard publication={base} />);
    const row = screen
      .getByText('A Tactile Paper')
      .closest('.paper-row') as HTMLElement;
    expect(row).toHaveClass('paper-row-selected');
    expect(screen.getByText('Selected')).toHaveClass('selected-badge');
    expect(screen.getByText('Tactile')).toHaveClass(
      'paper-tag',
      'paper-tag-manipulation',
    );
    expect(screen.getByText('CoRL 2026')).toHaveClass('venue-conference');
    expect(screen.getByText(/oral/i)).toHaveClass('paper-honor');
    // own name bold + equal-contrib marker
    expect(screen.getByText('Your Name').closest('b')).not.toBeNull();
    expect(screen.getByText('*', { selector: '.author-marker' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^paper$/i })).toHaveClass(
      'paper-link-paper',
    );
    expect(screen.getByText('code coming soon')).toHaveClass('paper-link-note');
    expect(screen.getByText('An abstract.')).toBeInTheDocument();
  });

  it('renders a non-selected row without selected styling', () => {
    const p: Publication = {
      ...base,
      selected: false,
      honor: undefined,
      thumbnail: undefined,
      tags: [{ label: 'Grasping', category: 'tactile' }],
      links: [{ kind: 'paper', href: '/p' }],
      note: undefined,
      abstract: undefined,
    };
    render(<PublicationCard publication={p} />);
    const row = screen
      .getByText('A Tactile Paper')
      .closest('.paper-row') as HTMLElement;
    expect(row).not.toHaveClass('paper-row-selected');
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });
});
