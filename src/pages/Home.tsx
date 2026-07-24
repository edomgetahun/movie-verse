import GenreRow from '../components/GenreRow.tsx';
import { GENRES, MARVEL_COMPANY_ID } from '../services/tmdb';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Now streaming</p>
          <h1>Every genre. One reel.</h1>
          <p className="hero-sub">
            Browse by genre, search anything, save what you love, and keep your downloads
            ready to watch offline.
          </p>
        </div>
      </section>

      <GenreRow title="Marvel" slug="marvel" companyId={MARVEL_COMPANY_ID} />
      {GENRES.map((g) => (
        <GenreRow key={g.id} title={g.name} slug={g.slug} genreId={g.id} />
      ))}
    </div>
  );
}