import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders copyright, back-to-top pill, and template credit', () => {
    render(<Footer name="Yijie Luo" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('site-footer');
    expect(footer.textContent).toMatch(/©\s*\d{4}\s*Yijie Luo/);
    const top = screen.getByRole('link', { name: /back to top/i });
    expect(top).toHaveAttribute('href', '#top');
    expect(top).toHaveClass('footer-top-link');
    expect(
      screen.getByRole('link', { name: /this template/i }),
    ).toHaveAttribute(
      'href',
      'https://github.com/jonbarron/jonbarron_website',
    );
  });
});
