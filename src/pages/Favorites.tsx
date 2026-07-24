import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      <div className="reel-divider" aria-hidden="true" />
      {favorites.length === 0 ? (
        <p className="status-text">No favorites yet. Tap the heart icon on any movie to save it here.</p>
      ) : (
        <div className="movie-grid">
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}