import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Projects } from './Projects';
import { projectsFixture } from '../test/fixtures';

describe('Projects', () => {
  it('renders all projects', () => {
    render(<Projects projects={projectsFixture} />);
    expect(screen.getByRole('heading', { name: 'Selected Projects' })).toBeInTheDocument();
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });
});
