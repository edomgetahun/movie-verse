import GenreRow from '../components/GenreRow.tsx';
import { GENRES, MARVEL_COMPANY_ID } from '../services/tmdb';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-surface">
          <div className="hero-content hero-content-main">
            <p className="hero-eyebrow">Now streaming</p>
            <h1>Every genre. One reel.</h1>
            <p className="hero-sub">
              Browse by genre, search anything, save what you love, and keep your downloads
              ready to watch offline.
            </p>
            <div className="hero-actions hero-pills" aria-label="Featured viewing modes">
              <span className="hero-pill hero-pill-gold">Trailer mode</span>
              <span className="hero-pill">Cast previews</span>
              <span className="hero-pill">Offline picks</span>
            </div>
            <div className="hero-mini-grid hero-mini-grid-inline">
              <div className="hero-mini-stat">
                <strong>20+</strong>
                <span>Curated rows</span>
              </div>
              <div className="hero-mini-stat">
                <strong>1 tap</strong>
                <span>Trailer + cast</span>
              </div>
              <div className="hero-mini-stat">
                <strong>Saved</strong>
                <span>Favorites & downloads</span>
              </div>
              <div className="hero-mini-stat">
                <strong>Fast</strong>
                <span>Search-first navigation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GenreRow title="Trending Now" special="trending" />
      <GenreRow title="Now Playing" special="now_playing" />
      <GenreRow title="Coming Soon" special="upcoming" />
      <GenreRow title="Marvel" slug="marvel" companyId={MARVEL_COMPANY_ID} />
      {GENRES.map((g) => (
        <GenreRow key={g.id} title={g.name} slug={g.slug} genreId={g.id} />
      ))}
    </div>
  );
}