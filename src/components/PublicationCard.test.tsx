import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from './PublicationCard';
import { publicationsFixture } from '../test/fixtures';

describe('PublicationCard', () => {
  it('renders title, venue, and authors', () => {
    render(<PublicationCard publication={publicationsFixture[0]} ownName="Jane Doe" />);
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.getByText('CoRL 2026')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('highlights the owner name in bold and underline', () => {
    render(<PublicationCard publication={publicationsFixture[0]} ownName="Jane Doe" />);
    const own = screen.getByText('Jane Doe');
    expect(own.tagName).toBe('STRONG');
    expect(own).toHaveClass('underline');
  });

  it('renders only present links', () => {
    render(<PublicationCard publication={publicationsFixture[1]} ownName="Jane Doe" />);
    expect(screen.getByRole('link', { name: 'Paper' })).toHaveAttribute(
      'href',
      'https://paper.example.com/2',
    );
    expect(screen.queryByRole('link', { name: 'Code' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Project' })).toBeNull();
  });

  it('renders the thumbnail when present', () => {
    const pub = { ...publicationsFixture[0], thumbnail: '/thumb.jpg' };
    render(<PublicationCard publication={pub} ownName="Jane Doe" />);
    expect(screen.getByAltText('Tactile Grasping Paper thumbnail')).toHaveAttribute(
      'src',
      '/thumb.jpg',
    );
  });
});
