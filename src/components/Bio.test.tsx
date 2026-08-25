import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bio } from './Bio';
import { profile } from '../data/profile';

describe('Bio', () => {
  it('renders the hero with name, intro, photo and contacts', () => {
    render(<Bio profile={profile} />);
    const card = screen
      .getByText(profile.nameEn)
      .closest('.profile-hero') as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(screen.getByText(profile.nameZh)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /rotate profile photo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: `${profile.nameEn} ${profile.nameZh}`,
      }),
    ).toHaveClass('profile-name-row');
  });
});
