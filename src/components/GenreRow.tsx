import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Movie } from '../types/movie';
import { getMoviesByGenre, getMoviesByCompany, getTrending, getNowPlaying, getUpcoming } from '../services/tmdb';
import MovieCard from './MovieCard';
import { EASE_OUT } from '../lib/motion';

type Special = 'trending' | 'now_playing' | 'upcoming';

interface GenreRowProps {
  title: string;
  slug?: string;
  genreId?: number;
  companyId?: number;
  special?: Special;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

export default function GenreRow({ title, slug, genreId, companyId, special }: GenreRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    let request: Promise<Movie[]>;
    if (special === 'trending') request = getTrending();
    else if (special === 'now_playing') request = getNowPlaying();
    else if (special === 'upcoming') request = getUpcoming();
    else if (companyId) request = getMoviesByCompany(companyId);
    else request = getMoviesByGenre(genreId!);

    request
      .then((data) => {
        if (!cancelled) {
          setMovies(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load movies');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [genreId, companyId, special]);

  return (
    <section className="mt-8 md:mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl">{title}</h2>
        {slug && (
          <Link to={`/genre/${slug}`} className="text-sm text-gold hover:text-gold-dim transition-colors shrink-0">
            See all →
          </Link>
        )}
      </div>
      <div className="reel-divider" aria-hidden="true" />
      {error && <p className="text-sm text-velvet">{error}</p>}
      {!error && loading && (
        <div className="row-scroll">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[150px] md:w-[170px] aspect-[2/3] shrink-0 rounded-md bg-panel-raised animate-pulse"
            />
          ))}
        </div>
      )}
      {!error && !loading && (
        <motion.div
          className="row-scroll"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {movies.map((m) => (
            <motion.div key={m.id} variants={item}>
              <MovieCard movie={m} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}