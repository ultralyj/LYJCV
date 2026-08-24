import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bio } from './Bio';
import { profileFixture } from '../test/fixtures';

describe('Bio', () => {
  it('renders name, Chinese name, bio text, and contact links', () => {
    render(<Bio profile={profileFixture} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('杜娟')).toBeInTheDocument();
    expect(
      screen.getByText(/Ph.D. student at Example University/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('renders the profile photo with alt text equal to the English name', () => {
    render(<Bio profile={profileFixture} />);
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
  });
});
