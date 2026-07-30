import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Play, Heart, Download, Check, Star } from 'lucide-react';
import { useMovieModal } from '../context/MovieModalContext';
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getMovieRecommendations,
  BACKDROP_BASE,
  IMAGE_BASE,
} from '../services/tmdb';
import type { CastMember, Movie, MovieDetail } from '../types/movie';
import { useDownloads } from '../context/DownloadsContext';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from './MovieCard';
import { EASE_OUT } from '../lib/motion';

export default function MovieModal() {
  const { openMovieId, closeMovie } = useMovieModal();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [related, setRelated] = useState<Movie[]>([]);
  const { isDownloaded, addDownload, removeDownload } = useDownloads();
  const { has, add, remove } = useFavorites();

  // Fetch everything fresh whenever a different movie is opened
  useEffect(() => {
    if (!openMovieId) return;
    setMovie(null);
    setTrailerKey(null);
    setShowTrailer(false);
    setCast([]);
    setRelated([]);

    getMovieDetails(String(openMovieId)).then(setMovie);
    getMovieVideos(openMovieId).then(setTrailerKey);
    getMovieCredits(openMovieId).then(setCast);
    getMovieRecommendations(openMovieId).then(setRelated);
  }, [openMovieId]);

  // Escape-to-close + lock background scroll while the modal is open
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMovie();
    }
    if (openMovieId) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [openMovieId, closeMovie]);

  const downloaded = movie ? isDownloaded(movie.id) : false;
  const favorited = movie ? has(movie.id) : false;

  return (
    <AnimatePresence>
      {openMovieId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 md:p-8"
          onClick={closeMovie}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-panel my-4 md:my-8"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <button
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-void/70 text-cream hover:bg-void transition-colors"
              onClick={closeMovie}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {!movie ? (
              <p className="p-16 text-center text-sm text-muted">Loading...</p>
            ) : (
              <>
                <div
                  className="relative h-[38vh] min-h-[220px] w-full bg-cover bg-center bg-panel-raised"
                  style={{
                    backgroundImage:
                      !showTrailer && movie.backdrop_path ? `url(${BACKDROP_BASE}${movie.backdrop_path})` : undefined,
                  }}
                >
                  {showTrailer && trailerKey ? (
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                      title={`${movie.title} trailer`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-t from-void/80 via-void/20 to-transparent">
                      {trailerKey && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowTrailer(true)}
                          className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-void"
                        >
                          <Play size={16} fill="currentColor" />
                          Play Trailer
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-5 md:px-8 py-6">
                  <h1 className="text-2xl md:text-4xl">{movie.title}</h1>
                  <p className="mt-2 flex items-center gap-1 text-sm text-muted">
                    {movie.release_date?.slice(0, 4)} · {movie.runtime} min ·
                    <Star size={14} className="text-gold" fill="currentColor" /> {movie.vote_average?.toFixed(1)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/80"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-cream/80">{movie.overview}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        downloaded
                          ? removeDownload(movie.id)
                          : addDownload({ ...movie, genre_ids: movie.genres.map((g) => g.id) })
                      }
                      className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-void"
                    >
                      {downloaded ? <Check size={16} /> : <Download size={16} />}
                      {downloaded ? 'Downloaded' : 'Download'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        favorited
                          ? remove(movie.id)
                          : add({ ...movie, genre_ids: movie.genres.map((g) => g.id) })
                      }
                      className="inline-flex items-center gap-2 rounded-md border border-cream/20 px-4 py-2 text-sm font-semibold text-cream"
                    >
                      <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
                      {favorited ? 'Favorited' : 'Add to Favorites'}
                    </motion.button>
                  </div>

                  {cast.length > 0 && (
                    <section className="mt-8">
                      <h2 className="text-lg">Cast</h2>
                      <div className="reel-divider" aria-hidden="true" />
                      <div className="row-scroll">
                        {cast.map((c, i) => (
                          <motion.div
                            key={c.id}
                            className="w-24 shrink-0 text-center"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
                          >
                            {c.profile_path ? (
                              <img
                                src={`${IMAGE_BASE}${c.profile_path}`}
                                alt={c.name}
                                className="aspect-square w-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex aspect-square w-full items-center justify-center rounded-full bg-panel-raised text-lg text-muted">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <p className="mt-1.5 truncate text-xs font-medium text-cream">{c.name}</p>
                            <p className="truncate text-xs text-muted">{c.character}</p>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {related.length > 0 && (
                    <section className="mt-8">
                      <h2 className="text-lg">More Like This</h2>
                      <div className="reel-divider" aria-hidden="true" />
                      <div className="row-scroll">
                        {related.slice(0, 12).map((m) => (
                          <MovieCard key={m.id} movie={m} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}