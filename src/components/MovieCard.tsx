import { motion, AnimatePresence } from 'motion/react';
import { Heart, Download, Check, Star } from 'lucide-react';
import type { Movie } from '../types/movie';
import { IMAGE_BASE } from '../services/tmdb';
import { useMovieModal } from '../context/MovieModalContext';
import { useDownloads } from '../context/DownloadsContext';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { openMovie } = useMovieModal();
  const { isDownloaded, addDownload, removeDownload } = useDownloads();
  const { has, add, remove } = useFavorites();
  const downloaded = isDownloaded(movie.id);
  const favorited = has(movie.id);

  return (
    <motion.div
      className="w-[150px] md:w-[170px] shrink-0"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <button
        type="button"
        className="group relative block w-full aspect-[2/3] overflow-hidden rounded-md bg-panel-raised"
        onClick={() => openMovie(movie.id)}
        aria-label={`Open trailer and cast for ${movie.title}`}
      >
        {movie.poster_path ? (
          <motion.img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-muted">
            {movie.title}
          </div>
        )}
        <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-void/80 px-1.5 py-0.5 text-xs font-medium text-gold backdrop-blur-sm">
          <Star size={11} fill="currentColor" />
          {movie.vote_average?.toFixed(1) ?? '—'}
        </span>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="mt-2 min-w-0">
        <p className="truncate text-sm font-medium text-cream" title={movie.title}>
          {movie.title}
        </p>
        <p className="text-xs text-muted">{movie.release_date?.slice(0, 4) || '—'}</p>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <IconToggle
          active={favorited}
          onClick={() => (favorited ? remove(movie.id) : add(movie))}
          label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          activeIcon={<Heart size={14} fill="currentColor" />}
          idleIcon={<Heart size={14} />}
        />
        <IconToggle
          active={downloaded}
          onClick={() => (downloaded ? removeDownload(movie.id) : addDownload(movie))}
          label={downloaded ? 'Remove download' : 'Download'}
          activeIcon={<Check size={14} />}
          idleIcon={<Download size={14} />}
        />
      </div>
    </motion.div>
  );
}

function IconToggle({
  active,
  onClick,
  label,
  activeIcon,
  idleIcon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  activeIcon: React.ReactNode;
  idleIcon: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={label}
      whileTap={{ scale: 0.8 }}
      className={
        active
          ? 'flex h-7 w-7 items-center justify-center rounded-full bg-gold text-void'
          : 'flex h-7 w-7 items-center justify-center rounded-full bg-panel-raised text-muted hover:text-cream'
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex items-center justify-center"
        >
          {active ? activeIcon : idleIcon}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}