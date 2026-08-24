import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagFilter } from './TagFilter';

describe('TagFilter', () => {
  const tags = [
    { label: 'All', value: 'all', count: 5 },
    { label: 'Tactile', value: 'Tactile', count: 2 },
    { label: 'Grasping', value: 'Grasping', count: 1 },
  ];

  it('renders each tag with its count', () => {
    render(<TagFilter tags={tags} value="all" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /All \(5\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tactile \(2\)/ })).toBeInTheDocument();
  });

  it('calls onChange with the tag value when clicked', async () => {
    const onChange = vi.fn();
    render(<TagFilter tags={tags} value="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Grasping/ }));
    expect(onChange).toHaveBeenCalledWith('Grasping');
  });

  it('marks the active tag with aria-pressed', () => {
    render(<TagFilter tags={tags} value="Tactile" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Tactile/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
