import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './Section';

describe('Section', () => {
  it('renders a card with a left-accent heading and body', () => {
    render(
      <Section id="news" title="News">
        <p>body</p>
      </Section>,
    );
    const section = screen.getByRole('region', { name: 'News' });
    expect(section).toHaveClass('site-section');
    expect(screen.getByText('News')).toHaveClass('section-heading');
    expect(screen.getByText('body')).toBeInTheDocument();
  });
});
