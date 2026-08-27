import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Awards } from '../../src/components/Awards';

describe('Awards', () => {
  it('renders prize, competition, and year for each award', () => {
    render(
      <Awards
        awards={[
          {
            prize: 'First Prize',
            competition: 'National Robotics Competition',
            year: '2025',
          },
        ]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Selected Awards' }),
    ).toBeInTheDocument();
    expect(screen.getByText('First Prize')).toBeInTheDocument();
    expect(screen.getByText('National Robotics Competition')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
});
