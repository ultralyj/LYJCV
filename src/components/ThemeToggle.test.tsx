import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders a fixed toggle button with an accessible label', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-toggle');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);
    await userEvent.click(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('announces light mode when theme is dark', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });
});
