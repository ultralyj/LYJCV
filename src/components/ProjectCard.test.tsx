import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from './ProjectCard';
import { projectsFixture } from '../test/fixtures';

describe('ProjectCard', () => {
  it('renders title, description, and links', () => {
    render(<ProjectCard project={projectsFixture[0]} />);
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('First project description.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/x/p1',
    );
  });

  it('omits absent links', () => {
    render(<ProjectCard project={projectsFixture[1]} />);
    expect(screen.queryByRole('link', { name: 'Code' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Report' })).toBeInTheDocument();
  });
});
