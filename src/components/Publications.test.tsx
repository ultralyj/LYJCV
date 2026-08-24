import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Publications } from './Publications';
import { publicationsFixture } from '../test/fixtures';

describe('Publications', () => {
  it('renders the section title and all publications initially', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByRole('heading', { name: 'Publications' })).toBeInTheDocument();
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.getByText('Manipulation Paper')).toBeInTheDocument();
    expect(screen.getByText('Other Paper')).toBeInTheDocument();
  });

  it('aggregates tags with counts including All', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByRole('button', { name: /All \(3\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tactile \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manipulation \(1\)/ })).toBeInTheDocument();
  });

  it('filters publications by tag', async () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    await userEvent.click(screen.getByRole('button', { name: /Tactile/ }));
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.queryByText('Manipulation Paper')).not.toBeInTheDocument();
    expect(screen.queryByText('Other Paper')).not.toBeInTheDocument();
  });

  it('filters to selected publications when ★ Selected is toggled', async () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    await userEvent.click(screen.getByRole('button', { name: /Selected/ }));
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.queryByText('Manipulation Paper')).not.toBeInTheDocument();
  });

  it('shows a visible count', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByText(/Showing 3 of 3/)).toBeInTheDocument();
  });
});
