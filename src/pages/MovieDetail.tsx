import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, BACKDROP_BASE, IMAGE_BASE } from '../services/tmdb';
import { MovieDetail } from '../types/movie';
import { useDownloads } from '../context/DownloadsContext';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const { isDownloaded, addDownload, removeDownload } = useDownloads();
  const { has, add, remove } = useFavorites();

  useEffect(() => {
    if (!id) return;
    getMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) return <p className="status-text">Loading...</p>;

  const downloaded = isDownloaded(movie.id);
  const favorited = has(movie.id);
  const movieForActions = { ...movie, genre_ids: movie.genres.map((g) => g.id) };

  return (
    <div
      className="movie-details"
      style={{
        backgroundImage: movie.backdrop_path ? `url(${BACKDROP_BASE}${movie.backdrop_path})` : undefined,
      }}
    >
      <div className="details-overlay">
        {movie.poster_path ? (
          <img className="details-poster" src={`${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} />
        ) : (
          <div className="details-poster poster-fallback">{movie.title}</div>
        )}
        <div className="details-content">
          <h1>{movie.title}</h1>
          <p className="details-meta">
            {movie.release_date?.slice(0, 4)} · {movie.runtime} min · ★ {movie.vote_average?.toFixed(1)}
          </p>
          <div className="genre-tags">
            {movie.genres.map((g) => (
              <span key={g.id} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>
          <p className="details-overview">{movie.overview}</p>
          <div className="details-actions">
            <button
              className="btn-primary"
              onClick={() => (downloaded ? removeDownload(movie.id) : addDownload(movieForActions))}
            >
              {downloaded ? '✓ Downloaded' : '⭳ Download'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => (favorited ? remove(movie.id) : add(movieForActions))}
            >
              {favorited ? '♥ Favorited' : '♡ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}