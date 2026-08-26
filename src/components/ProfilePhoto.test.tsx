import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProfilePhoto } from './ProfilePhoto';
import { withBase } from '../utils/asset';
import type { ProfilePhoto as ProfilePhotoType } from '../types';

const photos: ProfilePhotoType[] = [
  { src: '/a.jpg', caption: 'First photo' },
  { src: '/b.jpg', caption: 'Second photo' },
];

describe('ProfilePhoto', () => {
  it('renders the first photo as a circular clickable image', () => {
    render(<ProfilePhoto photos={photos} alt="Your Name" />);
    const img = screen.getByRole('button', { name: /rotate profile photo/i });
    expect(img).toBeInTheDocument();
    const im = img.querySelector('img');
    expect(im).toHaveAttribute('src', withBase('/a.jpg'));
    expect(im).toHaveAttribute('alt', 'Your Name');
    expect(screen.getByText('First photo')).toBeInTheDocument();
  });

  it('swaps photo and caption on click', async () => {
    vi.useFakeTimers();
    try {
      render(<ProfilePhoto photos={photos} alt="Your Name" />);
      fireEvent.click(
        screen.getByRole('button', { name: /rotate profile photo/i }),
      );
      // Swap applies inside a 180ms window.setTimeout in the component.
      await act(async () => {
        vi.advanceTimersByTime(180);
      });
      const im = screen
        .getByRole('button', { name: /rotate profile photo/i })
        .querySelector('img');
      expect(im).toHaveAttribute('src', withBase('/b.jpg'));
      expect(screen.getByText('Second photo')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders nothing when there are no photos', () => {
    const { container } = render(<ProfilePhoto photos={[]} alt="x" />);
    expect(container).toBeEmptyDOMElement();
  });
});
