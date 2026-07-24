import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface MovieModalContextType {
  openMovieId: number | null;
  openMovie: (id: number) => void;
  closeMovie: () => void;
}

const MovieModalContext = createContext<MovieModalContextType | undefined>(undefined);

export function MovieModalProvider({ children }: { children: ReactNode }) {
  const [openMovieId, setOpenMovieId] = useState<number | null>(null);

  return (
    <MovieModalContext.Provider
      value={{
        openMovieId,
        openMovie: (id: number) => setOpenMovieId(id),
        closeMovie: () => setOpenMovieId(null),
      }}
    >
      {children}
    </MovieModalContext.Provider>
  );
}

export function useMovieModal() {
  const ctx = useContext(MovieModalContext);
  if (!ctx) throw new Error('useMovieModal must be used within a MovieModalProvider');
  return ctx;
}