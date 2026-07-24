import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GENRES, MARVEL_COMPANY_ID, discoverMovies } from '../services/tmdb';
import type { SortOption } from '../services/tmdb';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest' },
  { value: 'release_date.asc', label: 'Oldest' },
];

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
    <div className="genre-page">
      <h1>{title}</h1>
      <div className="reel-divider" aria-hidden="true" />

      <div className="filters-bar">
        {!isMarvel && (
          <div className="genre-chips">
            {GENRES.map((g) => (
              <button
                key={g.id}
                type="button"
                className={selectedGenreIds.includes(g.id) ? 'chip active' : 'chip'}
                onClick={() => toggleGenre(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => {
            setPage(1);
            setSortBy(e.target.value as SortOption);
          }}
          aria-label="Sort movies"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      {loading && <p className="status-text">Loading...</p>}
      {!loading && movies.length === 0 && <p className="status-text">No movies match these filters.</p>}
      {!loading && movies.length > 0 && (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>
          Load more
        </button>
      )}
    </div>
  );
}