import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Projects } from './Projects';
import { projects } from '../data/projects';

describe('Projects', () => {
  it('renders all projects inside a card', () => {
    render(<Projects projects={projects} />);
    expect(
      screen.getByRole('region', { name: 'Selected Projects' }),
    ).toHaveClass('site-section');
    projects.forEach((p) =>
      expect(screen.getByText(p.title)).toBeInTheDocument(),
    );
  });
});
