import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GENRES, MARVEL_COMPANY_ID, getMoviesByGenre, getMoviesByCompany } from '../services/tmdb';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';

export default function GenrePage() {
  const { slug } = useParams();
  const genre = GENRES.find((g) => g.slug === slug);
  const isMarvel = slug === 'marvel';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset pagination whenever the genre changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    const request = isMarvel
      ? getMoviesByCompany(MARVEL_COMPANY_ID, page)
      : genre
      ? getMoviesByGenre(genre.id, page)
      : Promise.resolve([]);

    request.then((data) => {
      setMovies((prev) => (page === 1 ? data : [...prev, ...data]));
      setLoading(false);
    });
  }, [slug, page]);

  const title = isMarvel ? 'Marvel' : genre?.name || 'Not found';

  return (
    <div className="genre-page">
      <h1>{title}</h1>
      <div className="reel-divider" aria-hidden="true" />
      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      {loading && <p className="status-text">Loading...</p>}
      {!loading && movies.length > 0 && (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>
          Load more
        </button>
      )}
    </div>
  );
}