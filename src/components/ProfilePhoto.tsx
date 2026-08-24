import { useState } from 'react';

interface ProfilePhotoProps {
  photos: string[];
  alt: string;
}

export function ProfilePhoto({ photos, alt }: ProfilePhotoProps) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const current = photos[index % photos.length];

  return (
    <button
      type="button"
      aria-label="Rotate profile photo"
      onClick={() => setIndex((i) => (i + 1) % photos.length)}
      className="cursor-pointer rounded-md transition hover:opacity-90"
    >
      <img
        src={current}
        alt={alt}
        loading="lazy"
        className="h-48 w-40 rounded-md object-cover shadow-sm"
      />
    </button>
  );
}
