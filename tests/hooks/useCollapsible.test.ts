import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCollapsible } from '../../src/hooks/useCollapsible';

describe('useCollapsible', () => {
  it('starts collapsed and reports hidden count', () => {
    const { result } = renderHook(() => useCollapsible(10, 4));
    expect(result.current.expanded).toBe(false);
    expect(result.current.visibleCount).toBe(4);
    expect(result.current.hiddenCount).toBe(6);
  });

  it('shows all items when expanded', () => {
    const { result } = renderHook(() => useCollapsible(10, 4));
    act(() => result.current.toggle());
    expect(result.current.expanded).toBe(true);
    expect(result.current.visibleCount).toBe(10);
    expect(result.current.hiddenCount).toBe(0);
  });

  it('does not need expanding when total <= initial', () => {
    const { result } = renderHook(() => useCollapsible(3, 4));
    expect(result.current.visibleCount).toBe(3);
    expect(result.current.hiddenCount).toBe(0);
  });
});
