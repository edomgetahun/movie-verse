import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Info } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getTrending, BACKDROP_BASE } from '../services/tmdb';
import { useMovieModal } from '../context/MovieModalContext';
import { EASE_OUT } from '../lib/motion';

const STATS = [
  { value: '20+', label: 'Curated rows' },
  { value: '1 tap', label: 'Trailer + cast' },
  { value: 'Saved', label: 'Favorites & downloads' },
  { value: 'Fast', label: 'Search-first navigation' },
];

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const textItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export default function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const { openMovie } = useMovieModal();

  useEffect(() => {
    getTrending().then((movies) => {
      const withBackdrop = movies.find((m) => m.backdrop_path);
      setMovie(withBackdrop || movies[0] || null);
    });
  }, []);

  return (
    <section className="relative -mx-4 md:-mx-8 mb-4 overflow-hidden rounded-b-2xl">
      <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
        {movie?.backdrop_path ? (
          <motion.div
            key={movie.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})` }}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          />
        ) : (
          <div className="absolute inset-0 bg-panel animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/20 to-transparent" />

        <motion.div
          className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-4 px-4 md:px-8 pb-10"
          variants={textContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={textItem} className="text-sm font-medium tracking-wide text-gold">
            Now streaming
          </motion.p>
          <motion.h1 variants={textItem} className="text-4xl md:text-6xl leading-none text-cream">
            {movie ? movie.title : 'Every genre. One reel.'}
          </motion.h1>
          <motion.p variants={textItem} className="max-w-lg text-sm md:text-base text-cream/80">
            {movie
              ? `${movie.overview.slice(0, 160)}${movie.overview.length > 160 ? '…' : ''}`
              : 'Browse by genre, search anything, save what you love, and keep your downloads ready to watch offline.'}
          </motion.p>

          <motion.div variants={textItem} className="flex flex-wrap gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => movie && openMovie(movie.id)}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-void"
            >
              <Play size={16} fill="currentColor" />
              Play Trailer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => movie && openMovie(movie.id)}
              className="inline-flex items-center gap-2 rounded-md border border-cream/20 bg-cream/5 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur-sm"
            >
              <Info size={16} />
              More Info
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-cream/5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-panel px-4 py-3 text-center">
            <strong className="block font-display text-lg tracking-wide text-gold">{stat.value}</strong>
            <span className="text-xs text-muted">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}