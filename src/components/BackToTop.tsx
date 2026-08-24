import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export function BackToTop() {
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.scrollY > window.innerHeight,
  );

  useEffect(() => {
    const onScroll = () =>
      flushSync(() => setVisible(window.scrollY > window.innerHeight));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 rounded-full bg-accent px-3 py-2 text-sm text-white shadow-lg transition hover:opacity-90 dark:bg-accent-dark"
    >
      ↑
    </a>
  );
}
