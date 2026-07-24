import { useDownloads } from '../context/DownloadsContext';
import MovieCard from '../components/MovieCard';

export default function Downloads() {
  const { downloads } = useDownloads();

  return (
    <div className="downloads-page">
      <h1>Your Downloads</h1>
      <div className="reel-divider" aria-hidden="true" />
      {downloads.length === 0 ? (
        <p className="status-text">
          Nothing downloaded yet. Browse a genre and tap the download icon on any movie.
        </p>
      ) : (
        <div className="movie-grid">
          {downloads
            .slice()
            .sort((a, b) => b.downloadedAt - a.downloadedAt)
            .map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
        </div>
      )}
    </div>
  );
}