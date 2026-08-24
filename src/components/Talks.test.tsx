import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Talks } from './Talks';

describe('Talks', () => {
  it('renders talks with host and optional replay link', () => {
    render(
      <Talks
        talks={[
          { date: 'May 2026', title: 'A Talk', host: 'Some Seminar', replay: 'https://r' },
          { date: 'Oct 2025', title: 'Another', host: 'Workshop' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Talks' })).toBeInTheDocument();
    expect(screen.getByText('A Talk')).toBeInTheDocument();
    expect(screen.getByText(/Some Seminar/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /replay/i })).toHaveAttribute('href', 'https://r');
  });
});
