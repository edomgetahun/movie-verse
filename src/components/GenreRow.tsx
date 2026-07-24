import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { getMoviesByGenre, getMoviesByCompany, getTrending, getNowPlaying, getUpcoming } from '../services/tmdb';
import MovieCard from './MovieCard';

type Special = 'trending' | 'now_playing' | 'upcoming';

interface GenreRowProps {
  title: string;
  slug?: string;
  genreId?: number;
  companyId?: number;
  special?: Special;
}

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
    <section className="genre-row">
      <div className="genre-row-header">
        <h2>{title}</h2>
        {slug && <Link to={`/genre/${slug}`} className="see-all">See all →</Link>}
      </div>
      <div className="reel-divider" aria-hidden="true" />
      {error && <p className="status-text error">{error}</p>}
      {!error && loading && (
        <div className="row-scroll">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}
      {!error && !loading && (
        <div className="row-scroll">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}