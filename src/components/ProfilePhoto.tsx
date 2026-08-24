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
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onClick={() => setIndex((i) => (i + 1) % photos.length)}
      className="h-48 w-40 cursor-pointer rounded-md object-cover shadow-sm transition hover:opacity-90"
    />
  );
}
