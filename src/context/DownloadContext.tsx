import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorageList } from '../hooks/useLocalStorageList';
import { Movie, DownloadedMovie } from '../types/movie';

interface DownloadsContextType {
  downloads: DownloadedMovie[];
  addDownload: (movie: Movie) => void;
  removeDownload: (id: number) => void;
  isDownloaded: (id: number) => boolean;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

export function DownloadsProvider({ children }: { children: ReactNode }) {
  const { items, add, remove, has } = useLocalStorageList<DownloadedMovie>('movieapp_downloads');

  function addDownload(movie: Movie) {
    add({ ...movie, downloadedAt: Date.now() });
  }

  return (
    <DownloadsContext.Provider
      value={{ downloads: items, addDownload, removeDownload: remove, isDownloaded: has }}
    >
      {children}
    </DownloadsContext.Provider>
  );
}

export function useDownloads() {
  const ctx = useContext(DownloadsContext);
  if (!ctx) throw new Error('useDownloads must be used within a DownloadsProvider');
  return ctx;
}