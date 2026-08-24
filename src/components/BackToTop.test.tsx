import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('is hidden before the user scrolls past one viewport', () => {
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    render(<BackToTop />);
    expect(screen.queryByRole('link', { name: /back to top/i })).toBeNull();
  });

  it('appears after scrolling past one viewport and links to top', () => {
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    render(<BackToTop />);
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    const link = screen.getByRole('link', { name: /back to top/i });
    expect(link).toHaveAttribute('href', '#top');
  });
});
