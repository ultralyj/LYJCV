import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the name and a back-to-top link', () => {
    render(<Footer name="Jane Doe" />);
    expect(screen.getByText(/©/)).toHaveTextContent('Jane Doe');
    expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top');
  });
});
