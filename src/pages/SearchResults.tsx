import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { searchMovies } from '../services/tmdb';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { EASE_OUT } from '../lib/motion';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const cell = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }
    setLoading(true);
    searchMovies(query).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="pt-6">
      <h1 className="text-3xl md:text-4xl">Results for &ldquo;{query}&rdquo;</h1>
      <div className="reel-divider" aria-hidden="true" />
      {loading && <p className="text-sm text-muted">Searching...</p>}
      {!loading && movies.length === 0 && <p className="text-sm text-muted">No movies found. Try another title.</p>}
      <motion.div
        className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6"
        variants={grid}
        initial="hidden"
        animate="show"
        key={query}
      >
        {movies.map((m) => (
          <motion.div key={m.id} variants={cell} className="mx-auto w-full max-w-[170px]">
            <MovieCard movie={m} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}