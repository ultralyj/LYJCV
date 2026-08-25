import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { News } from './News';
import type { NewsItem } from '../types';

const items: NewsItem[] = Array.from({ length: 8 }, (_, i) => ({
  date: `2026-0${i + 1}`,
  content: `News item number ${i + 1}`,
}));

describe('News', () => {
  it('shows 5 items initially with a collapsed list and an expand toggle', () => {
    render(<News items={items} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('list')).toHaveAttribute('data-collapsed', 'true');
    expect(
      screen.getByRole('button', { name: /show earlier news/i }),
    ).toBeInTheDocument();
  });

  it('expands to all items when toggled', async () => {
    render(<News items={items} />);
    await userEvent.click(
      screen.getByRole('button', { name: /show earlier news/i }),
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(
      screen.getByRole('button', { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it('renders no toggle when there are 5 or fewer items', () => {
    render(<News items={items.slice(0, 4)} />);
    expect(
      screen.queryByRole('button', { name: /show/i }),
    ).not.toBeInTheDocument();
  });
});
