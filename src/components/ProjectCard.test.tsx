import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from './ProjectCard';
import { withBase } from '../utils/asset';
import type { Project } from '../types';

const project: Project = {
  title: 'Example Project One',
  description: 'A short description.',
  thumbnail: '/p.jpg',
  links: [
    { kind: 'code', href: '/code' },
    { kind: 'report', href: '/report' },
  ],
};

describe('ProjectCard', () => {
  it('renders a paper-style row with image, title, description and links', () => {
    render(<ProjectCard project={project} />);
    const row = screen
      .getByText('Example Project One')
      .closest('.paper-row') as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByAltText(/teaser/)).toHaveAttribute(
      'src',
      withBase('/p.jpg'),
    );
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveClass(
      'paper-link-code',
    );
    expect(screen.getByText('A short description.')).toBeInTheDocument();
  });
});
