import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  it('defaults to light and sets no data-theme attribute when light', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: false }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('persists dark preference and sets data-theme="dark"', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: true }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles the data-theme attribute', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: false }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });
});
