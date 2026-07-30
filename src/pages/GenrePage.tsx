import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { GENRES, MARVEL_COMPANY_ID, discoverMovies } from '../services/tmdb';
import type { SortOption } from '../services/tmdb';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { EASE_OUT } from '../lib/motion';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest' },
  { value: 'release_date.asc', label: 'Oldest' },
];

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const cell = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export default function GenrePage() {
  const { slug } = useParams();
  const baseGenre = GENRES.find((g) => g.slug === slug);
  const isMarvel = slug === 'marvel';

  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(baseGenre ? [baseGenre.id] : []);
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset filters whenever navigating to a different genre page
  useEffect(() => {
    setSelectedGenreIds(baseGenre ? [baseGenre.id] : []);
    setSortBy('popularity.desc');
    setMovies([]);
    setPage(1);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    discoverMovies({
      genreIds: selectedGenreIds.length ? selectedGenreIds : undefined,
      companyId: isMarvel ? MARVEL_COMPANY_ID : undefined,
      sortBy,
      page,
    }).then((data) => {
      setMovies((prev) => (page === 1 ? data : [...prev, ...data]));
      setLoading(false);
    });
  }, [selectedGenreIds, sortBy, page, isMarvel]);

  function toggleGenre(id: number) {
    setPage(1);
    setSelectedGenreIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  const title = isMarvel ? 'Marvel' : baseGenre?.name || 'Browse';

  return (
    <div className="pt-6">
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      <div className="reel-divider" aria-hidden="true" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {!isMarvel && (
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const active = selectedGenreIds.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGenre(g.id)}
                  className={
                    active
                      ? 'relative rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-void transition-colors'
                      : 'relative rounded-full bg-panel-raised px-3.5 py-1.5 text-xs font-medium text-muted hover:text-cream transition-colors'
                  }
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        )}
        <select
          value={sortBy}
          onChange={(e) => {
            setPage(1);
            setSortBy(e.target.value as SortOption);
          }}
          aria-label="Sort movies"
          className="shrink-0 rounded-md border border-cream/10 bg-panel px-3 py-1.5 text-sm text-cream outline-none focus:border-gold/60"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <motion.div
        className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6"
        variants={grid}
        initial="hidden"
        animate="show"
        key={`${slug}-${sortBy}-${selectedGenreIds.join(',')}`}
      >
        {movies.map((m) => (
          <motion.div key={m.id} variants={cell} className="mx-auto w-full max-w-[170px]">
            <MovieCard movie={m} />
          </motion.div>
        ))}
      </motion.div>

      {loading && <p className="mt-6 text-sm text-muted">Loading...</p>}
      {!loading && movies.length === 0 && <p className="mt-6 text-sm text-muted">No movies match these filters.</p>}
      {!loading && movies.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage((p) => p + 1)}
          className="mx-auto mt-8 block rounded-md border border-cream/15 px-6 py-2.5 text-sm font-medium text-cream hover:border-gold/60"
        >
          Load more
        </motion.button>
      )}
    </div>
  );
}