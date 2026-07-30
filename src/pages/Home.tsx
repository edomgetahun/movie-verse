import Hero from '../components/Hero.tsx';
import GenreRow from '../components/GenreRow.tsx';
import { GENRES, MARVEL_COMPANY_ID } from '../services/tmdb';

export default function Home() {
  return (
    <div>
      <Hero />
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