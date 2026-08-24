import { useCallback, useMemo, useState } from 'react';

export function useCollapsible(total: number, initialVisible: number) {
  const [expanded, setExpanded] = useState(false);

  const visibleCount = expanded ? total : Math.min(total, initialVisible);
  const hiddenCount = Math.max(0, total - visibleCount);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return useMemo(
    () => ({ expanded, visibleCount, hiddenCount, toggle }),
    [expanded, visibleCount, hiddenCount, toggle],
  );
}
