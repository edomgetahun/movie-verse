import { useEffect, useState } from 'react';
import { useMovieModal } from '../context/MovieModalContext';
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getMovieRecommendations,
  BACKDROP_BASE,
  IMAGE_BASE,
} from '../services/tmdb';
import type { CastMember, Movie, MovieDetail } from '../types/movie';
import { useDownloads } from '../context/DownloadsContext';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from './MovieCard';

export default function MovieModal() {
  const { openMovieId, closeMovie } = useMovieModal();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [related, setRelated] = useState<Movie[]>([]);
  const { isDownloaded, addDownload, removeDownload } = useDownloads();
  const { has, add, remove } = useFavorites();

  // Fetch everything fresh whenever a different movie is opened
  useEffect(() => {
    if (!openMovieId) return;
    setMovie(null);
    setTrailerKey(null);
    setShowTrailer(false);
    setCast([]);
    setRelated([]);

    getMovieDetails(String(openMovieId)).then(setMovie);
    getMovieVideos(openMovieId).then(setTrailerKey);
    getMovieCredits(openMovieId).then(setCast);
    getMovieRecommendations(openMovieId).then(setRelated);
  }, [openMovieId]);

  // Escape-to-close + lock background scroll while the modal is open
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMovie();
    }
    if (openMovieId) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [openMovieId, closeMovie]);

  if (!openMovieId) return null;

  const downloaded = movie ? isDownloaded(movie.id) : false;
  const favorited = movie ? has(movie.id) : false;

  return (
    <div className="modal-backdrop" onClick={closeMovie}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeMovie} aria-label="Close">
          ✕
        </button>

        {!movie ? (
          <p className="status-text modal-loading">Loading...</p>
        ) : (
          <>
            <div
              className="modal-hero"
              style={{
                backgroundImage:
                  !showTrailer && movie.backdrop_path ? `url(${BACKDROP_BASE}${movie.backdrop_path})` : undefined,
              }}
            >
              {showTrailer && trailerKey ? (
                <iframe
                  className="modal-trailer-frame"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="modal-hero-overlay">
                  {trailerKey && (
                    <button className="btn-primary" onClick={() => setShowTrailer(true)}>
                      ▶ Play Trailer
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="modal-body">
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
                  onClick={() =>
                    downloaded
                      ? removeDownload(movie.id)
                      : addDownload({ ...movie, genre_ids: movie.genres.map((g) => g.id) })
                  }
                >
                  {downloaded ? '✓ Downloaded' : '⭳ Download'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    favorited
                      ? remove(movie.id)
                      : add({ ...movie, genre_ids: movie.genres.map((g) => g.id) })
                  }
                >
                  {favorited ? '♥ Favorited' : '♡ Add to Favorites'}
                </button>
              </div>

              {cast.length > 0 && (
                <section className="modal-section">
                  <h2>Cast</h2>
                  <div className="reel-divider" aria-hidden="true" />
                  <div className="cast-scroll">
                    {cast.map((c) => (
                      <div key={c.id} className="cast-card">
                        {c.profile_path ? (
                          <img src={`${IMAGE_BASE}${c.profile_path}`} alt={c.name} />
                        ) : (
                          <div className="cast-photo-fallback">{c.name.charAt(0)}</div>
                        )}
                        <p className="cast-name">{c.name}</p>
                        <p className="cast-character">{c.character}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {related.length > 0 && (
                <section className="modal-section">
                  <h2>More Like This</h2>
                  <div className="reel-divider" aria-hidden="true" />
                  <div className="row-scroll">
                    {related.slice(0, 12).map((m) => (
                      <MovieCard key={m.id} movie={m} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}