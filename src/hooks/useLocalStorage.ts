// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

/** 
 * A hook that mirrors a piece of state to localStorage under the given key.
 * T must be JSON‑serializable.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // localStorage might be full or disabled; ignore
    }
  }, [key, stored]);

  return [stored, setStored];
}
