import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { IMAGE_BASE } from '../services/tmdb';
import { useDownloads } from '../context/DownloadsContext';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isDownloaded, addDownload, removeDownload } = useDownloads();
  const { has, add, remove } = useFavorites();
  const downloaded = isDownloaded(movie.id);
  const favorited = has(movie.id);

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-poster-link">
        {movie.poster_path ? (
          <img src={`${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} loading="lazy" />
        ) : (
          <div className="poster-fallback">{movie.title}</div>
        )}
        <span className="movie-rating">★ {movie.vote_average?.toFixed(1) ?? '—'}</span>
      </Link>
      <div className="movie-info">
        <p className="movie-title" title={movie.title}>{movie.title}</p>
        <p className="movie-year">{movie.release_date?.slice(0, 4) || '—'}</p>
      </div>
      <div className="movie-actions">
        <button
          className={favorited ? 'icon-btn active' : 'icon-btn'}
          onClick={() => (favorited ? remove(movie.id) : add(movie))}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? '♥' : '♡'}
        </button>
        <button
          className={downloaded ? 'icon-btn active' : 'icon-btn'}
          onClick={() => (downloaded ? removeDownload(movie.id) : addDownload(movie))}
          title={downloaded ? 'Remove download' : 'Download'}
        >
          {downloaded ? '✓' : '⭳'}
        </button>
      </div>
    </div>
  );
}