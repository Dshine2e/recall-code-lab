'use client';

import { useCallback, useSyncExternalStore } from 'react';

// 이 브라우저에만 두는 편의 설정(언어 탭, 주제 표시). 기록은 여기에 두지 않는다.
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  window.addEventListener('storage', fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', fn);
  };
};

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function usePref<T extends string>(key: string, fallback: T): [T, (v: T) => void] {
  const value = useSyncExternalStore(subscribe, () => (read(key) as T | null) ?? fallback, () => fallback);
  const set = useCallback((v: T) => {
    try { localStorage.setItem(key, v); } catch { /* 저장소를 못 써도 화면은 동작한다 */ }
    listeners.forEach((fn) => fn());
  }, [key]);
  return [value, set];
}
