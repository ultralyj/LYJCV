import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PublicationsFilter } from '../../src/components/PublicationsFilter';
import type { TagCategory } from '../../src/types';

const buttons: { label: string; value: string; count: number; category?: TagCategory | 'selected' }[] = [
  { label: 'All', value: 'all', count: 3 },
  { label: 'Selected', value: 'selected', count: 1, category: 'selected' },
  { label: 'Grasping', value: 'Grasping', count: 2, category: 'tactile' },
];

describe('PublicationsFilter', () => {
  it('renders the label and buttons with count badges', () => {
    render(
      <PublicationsFilter
        buttons={buttons}
        value="all"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Filter by topic:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass(
      'is-active',
    );
    expect(screen.getByText('1', { selector: '.pub-filter-count' })).toBeInTheDocument();
  });

  it('marks the Selected button with the amber class', () => {
    render(
      <PublicationsFilter buttons={buttons} value="selected" onChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /selected/i })).toHaveClass(
      'pub-filter-btn-selected',
      'is-active',
    );
  });

  it('calls onChange with the button value', async () => {
    const onChange = vi.fn();
    render(
      <PublicationsFilter buttons={buttons} value="all" onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /grasping/i }));
    expect(onChange).toHaveBeenCalledWith('Grasping');
  });
});
