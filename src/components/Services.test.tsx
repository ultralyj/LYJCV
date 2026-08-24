import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Services } from './Services';

describe('Services', () => {
  it('renders group headings and items', () => {
    render(
      <Services
        groups={[
          { heading: 'Conference Reviewing', items: ['ICRA 2026', 'CoRL 2025'] },
          { heading: 'Journal Reviewing', items: ['RA-L'] },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Academic Services' })).toBeInTheDocument();
    expect(screen.getByText('Conference Reviewing')).toBeInTheDocument();
    expect(screen.getByText('ICRA 2026')).toBeInTheDocument();
    expect(screen.getByText('RA-L')).toBeInTheDocument();
  });
});
