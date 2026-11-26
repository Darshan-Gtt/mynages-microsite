import { useEffect, useState } from 'react';

/**
 * useState that survives a page refresh. Uses sessionStorage by default so in-progress
 * wizards and drafts are restored on refresh but not shared across tabs forever.
 */
export function usePersistentState<T>(key: string, initial: T, storage: 'session' | 'local' = 'session') {
  const store = () => (storage === 'session' ? sessionStorage : localStorage);
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = store().getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      store().setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);
  const clear = () => {
    try {
      store().removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initial);
  };
  return [value, setValue, clear] as const;
}
