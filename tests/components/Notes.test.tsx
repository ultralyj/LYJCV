import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notes } from '../../src/components/Notes';

describe('Notes', () => {
  it('renders note links', () => {
    render(
      <Notes
        notes={[
          { title: 'Robot Learning Notes', href: 'https://n1', description: 'scribbles' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Others' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Robot Learning Notes' })).toHaveAttribute(
      'href',
      'https://n1',
    );
    expect(screen.getByText(/scribbles/)).toBeInTheDocument();
  });
});
