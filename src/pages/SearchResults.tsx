import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';

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
    <div className="search-page">
      <h1>Results for &ldquo;{query}&rdquo;</h1>
      <div className="reel-divider" aria-hidden="true" />
      {loading && <p className="status-text">Searching...</p>}
      {!loading && movies.length === 0 && (
        <p className="status-text">No movies found. Try another title.</p>
      )}
      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}