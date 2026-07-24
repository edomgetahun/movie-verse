import type { Movie, MovieDetail } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_TMDB_API_KEY. Add it to a .env file in the project root (see README).'
    );
  }
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Static genre catalog used to build the homepage rows and genre pages.
// TMDB doesn't have a "Marvel" genre, so that row is handled separately
// via the Marvel Studios company id.
export const GENRES = [
  { id: 28, name: 'Action', slug: 'action' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 10749, name: 'Romance', slug: 'romance' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 27, name: 'Horror', slug: 'horror' },
  { id: 878, name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 16, name: 'Animation', slug: 'animation' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 53, name: 'Thriller', slug: 'thriller' },
  { id: 14, name: 'Fantasy', slug: 'fantasy' },
];

export const MARVEL_COMPANY_ID = 420;

interface DiscoverResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<Movie[]> {
  const data = await fetchTMDB<DiscoverResponse>('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
  return data.results;
}

export async function getMoviesByCompany(companyId: number, page = 1): Promise<Movie[]> {
  const data = await fetchTMDB<DiscoverResponse>('/discover/movie', {
    with_companies: String(companyId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
  return data.results;
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await fetchTMDB<DiscoverResponse>('/search/movie', {
    query,
    page: String(page),
    include_adult: 'false',
  });
  return data.results;
}

export async function getMovieDetails(id: string): Promise<MovieDetail> {
  return fetchTMDB<MovieDetail>(`/movie/${id}`);
}

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDB<DiscoverResponse>('/trending/movie/week');
  return data.results;
}