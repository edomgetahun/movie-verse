import { useEffect, useState } from 'react';

export function useLocalStorageList<T extends { id: number }>(key: string) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  function add(item: T) {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function has(id: number) {
    return items.some((i) => i.id === id);
  }

  return { items, add, remove, has };
}