import { useState } from 'react';
import type { ProfilePhoto as ProfilePhotoType } from '../types';
import { withBase } from '../utils/asset';

interface ProfilePhotoProps {
  photos: ProfilePhotoType[];
  alt: string;
}

export function ProfilePhoto({ photos, alt }: ProfilePhotoProps) {
  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [pulse, setPulse] = useState(false);

  if (photos.length === 0) return null;
  const current = photos[index % photos.length];

  const handleClick = () => {
    if (photos.length < 2) {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 500);
      return;
    }
    setSwapping(true);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length);
      setSwapping(false);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 500);
    }, 180);
  };

  const imgClass = [
    'profile-photo',
    swapping ? 'is-photo-swapping' : '',
    pulse ? 'is-photo-pulse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="profile-photo-col">
      <button
        type="button"
        className="profile-photo-button"
        aria-label="Rotate profile photo"
        onClick={handleClick}
      >
        <img
          src={withBase(current.src)}
          alt={alt}
          loading="lazy"
          className={imgClass}
        />
      </button>
      <p
        className={`profile-caption${swapping ? ' is-caption-swapping' : ''}`}
        dangerouslySetInnerHTML={{ __html: current.caption }}
      />
    </div>
  );
}
