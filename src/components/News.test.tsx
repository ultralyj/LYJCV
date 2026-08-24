import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { News } from './News';
import { newsFixture } from '../test/fixtures';

describe('News', () => {
  it('renders the section title', () => {
    render(<News items={newsFixture} />);
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument();
  });

  it('shows 4 items initially and a show-more toggle', () => {
    render(<News items={newsFixture} />);
    expect(screen.getByText('Paper accepted to CoRL 2026.')).toBeInTheDocument();
    expect(screen.queryByText('Award.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  it('expands and collapses', async () => {
    render(<News items={newsFixture} />);
    await userEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getByText('Award.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /show less/i }));
    expect(screen.queryByText('Award.')).not.toBeInTheDocument();
  });
});
