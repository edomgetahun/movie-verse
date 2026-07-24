import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorageList } from '../hooks/useLocalStorageList';
import type { Movie } from '../types/movie';

interface FavoritesContextType {
  favorites: Movie[];
  add: (movie: Movie) => void;
  remove: (id: number) => void;
  has: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { items, add, remove, has } = useLocalStorageList<Movie>('movieapp_favorites');

  return (
    <FavoritesContext.Provider value={{ favorites: items, add, remove, has }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}