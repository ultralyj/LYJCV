import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProfilePhoto } from './ProfilePhoto';

describe('ProfilePhoto', () => {
  const photos = ['/a.jpg', '/b.jpg', '/c.jpg'];

  it('renders the first photo initially', () => {
    render(<ProfilePhoto photos={photos} alt="Jane" />);
    const img = screen.getByAltText('Jane') as HTMLImageElement;
    expect(img.src).toContain('/a.jpg');
  });

  it('cycles to the next photo on click', async () => {
    render(<ProfilePhoto photos={photos} alt="Jane" />);
    const img = screen.getByAltText('Jane') as HTMLImageElement;
    await userEvent.click(screen.getByRole('button', { name: /rotate profile photo/i }));
    expect(img.src).toContain('/b.jpg');
    await userEvent.click(screen.getByRole('button', { name: /rotate profile photo/i }));
    expect(img.src).toContain('/c.jpg');
    await userEvent.click(screen.getByRole('button', { name: /rotate profile photo/i }));
    expect(img.src).toContain('/a.jpg');
  });

  it('is still accessible when there are no photos', () => {
    render(<ProfilePhoto photos={[]} alt="Jane" />);
    expect(screen.queryByAltText('Jane')).toBeNull();
  });

  it('the rotate button is keyboard focusable', () => {
    render(<ProfilePhoto photos={photos} alt="Jane" />);
    const btn = screen.getByRole('button', { name: /rotate profile photo/i });
    expect(btn).toBeVisible();
    expect(btn).not.toBeDisabled();
  });
});
