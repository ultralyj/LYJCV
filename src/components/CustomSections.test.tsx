import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CustomSections } from './CustomSections';
import type { CustomSection } from '../types';

const sections: CustomSection[] = [
  {
    id: 'hobbies',
    title: 'Hobbies',
    layout: 'cards',
    items: [
      { title: 'Photography', description: 'Travel photos.', href: 'https://example.com' },
      { title: 'Reading', description: 'Sci-fi books.' },
    ],
  },
  {
    id: 'awards',
    title: 'Awards',
    layout: 'list',
    items: [{ title: 'Best Paper', description: 'At a venue, 2025' }],
  },
  {
    id: 'misc',
    title: 'Misc',
    layout: 'paragraph',
    items: [{ description: 'A paragraph of text.' }],
  },
];

describe('CustomSections', () => {
  it('renders nothing for an empty array', () => {
    const { container } = render(<CustomSections sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders each section with an id anchor and title', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByRole('heading', { name: 'Hobbies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Awards' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Misc' })).toBeInTheDocument();
    const hobbiesSection = document.getElementById('hobbies');
    expect(hobbiesSection).not.toBeNull();
  });

  it('renders card layout with links', () => {
    render(<CustomSections sections={sections} />);
    const photo = screen.getByText('Photography');
    expect(photo.closest('a')).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('Travel photos.')).toBeInTheDocument();
  });

  it('renders list layout', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByText('Best Paper')).toBeInTheDocument();
    expect(screen.getByText('At a venue, 2025')).toBeInTheDocument();
  });

  it('renders paragraph layout', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByText('A paragraph of text.')).toBeInTheDocument();
  });

  it('renders links in list layout when href is provided', () => {
    const sectionsWithLinks: CustomSection[] = [
      {
        id: 'links',
        title: 'Links',
        layout: 'list',
        items: [{ title: 'My repo', href: 'https://github.com/x', description: 'code' }],
      },
    ];
    render(<CustomSections sections={sectionsWithLinks} />);
    const link = screen.getByRole('link', { name: 'My repo' });
    expect(link).toHaveAttribute('href', 'https://github.com/x');
    expect(screen.getByText('code')).toBeInTheDocument();
  });
});
