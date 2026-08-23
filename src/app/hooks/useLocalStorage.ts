import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key '${key}':`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key '${key}':`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * Like `useLocalStorage<string>` but stays in sync across components in the
 * same window via custom events — when component A writes, component B
 * re-reads immediately. Used for shared fields like FTD Rank that appear
 * in multiple cards on the same page.
 */
export function useSharedLocalStorageString(
  key: string,
  defaultValue: string,
): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    const onCustom = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      if (e.detail?.key === key) {
        setValue((e.detail.value as string) ?? defaultValue);
      }
    };
    window.addEventListener("local-storage-sync", onCustom);
    return () => window.removeEventListener("local-storage-sync", onCustom);
  }, [key, defaultValue]);

  const write = useCallback(
    (newValue: string) => {
      setValue(newValue);
      try {
        localStorage.setItem(key, newValue);
      } catch { /* noop */ }
      window.dispatchEvent(
        new CustomEvent("local-storage-sync", {
          detail: { key, value: newValue },
        }),
      );
    },
    [key],
  );

  return [value, write];
}
