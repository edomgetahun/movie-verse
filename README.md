# MovieVerse

A modern movie browsing website built with React, TypeScript, and the TMDB API. Browse by genre, search any title, watch trailers, check cast and recommendations, and keep a personal watchlist — all in a dark, cinema-themed UI.

## Features

- **Hero banner** — a trending movie with backdrop, synopsis, and quick actions
- **Genre rows** — Action, Comedy, Romance, Crime, Horror, Sci-Fi, Animation, Drama, Thriller, Fantasy, plus a dedicated Marvel row
- **Trending Now / New Releases / Coming Soon** rows on the homepage
- **Search** — find any movie by title
- **Movie detail modal** — trailer playback (YouTube embed), cast list, and "More Like This" recommendations, all without leaving the page you were browsing
- **Hover previews** — hovering a poster reveals a short synopsis
- **Favorites** — save movies you love, persisted in your browser
- **Downloads / Watchlist** — save movies to a personal list for later (see note below on what this means)
- **Genre pages** — multi-select genre filters plus sort by popularity, rating, or release date

## A note on "Downloads"

TMDB only provides movie metadata and images, not video files. There's no way for a frontend-only app to offer real downloads without a licensed video source and a backend to serve it. What's built here is a **watchlist that behaves like a download list** — saved locally, listed on its own page — which is the honest and realistic scope for a learning project like this.

## Tech stack

- React + TypeScript
- Vite
- React Router
- TMDB API (themoviedb.org)
- Plain CSS (no framework) with a custom cinema/marquee design system
- Browser `localStorage` for Favorites and Downloads (no backend)

## Getting started

### 1. Get a free TMDB API key

1. Sign up at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to your avatar (top right) → **Settings** → **API**
3. Click **Create** under "Request an API Key" → choose **Developer**
4. Fill the short form (personal/learning use) — approval is instant
5. Copy the **API Key (v3 auth)** from the API settings page

### 2. Install dependencies

```bash
npm install
npm install react-router-dom
```

### 3. Add your API key

Create a `.env` file in the project root (same folder as `package.json`):

```
VITE_TMDB_API_KEY=paste_your_key_here
```

Make sure `.env` is listed in your `.gitignore` so the key never gets committed.

### 4. Run the dev server

```bash
npm run dev
```

Open the printed local URL in your browser.

## Project structure

```
src/
  types/
    movie.ts               # Movie, MovieDetail, CastMember, DownloadedMovie types
  services/
    tmdb.ts                 # All TMDB API calls
  hooks/
    useLocalStorageList.ts  # Shared localStorage-backed list logic
  context/
    DownloadsContext.tsx    # Downloads/watchlist state
    FavoritesContext.tsx    # Favorites state
    MovieModalContext.tsx   # Controls which movie's detail modal is open
  components/
    Navbar.tsx
    SearchBar.tsx
    Hero.tsx                # Homepage hero banner
    GenreRow.tsx            # Horizontal scrolling row (genre / company / special feeds)
    MovieCard.tsx           # Poster card with hover preview + favorite/download actions
    MovieModal.tsx          # Detail modal: trailer, cast, recommendations
  pages/
    Home.tsx
    GenrePage.tsx           # Full grid with genre filter chips + sort
    SearchResults.tsx
    Downloads.tsx
    Favorites.tsx
  App.tsx                   # Routes + context providers
  App.css                   # All component/page styles
  index.css                 # Design tokens, resets, global typography
  main.tsx                  # React entry point
```

## Where things come from (TMDB endpoints used)

| Feature | Endpoint |
|---|---|
| Genre rows / genre page | `/discover/movie` (`with_genres`, `sort_by`) |
| Marvel row | `/discover/movie` (`with_companies=420`) |
| Search | `/search/movie` |
| Trending row + hero | `/trending/movie/week` |
| New Releases | `/movie/now_playing` |
| Coming Soon | `/movie/upcoming` |
| Movie detail | `/movie/{id}` |
| Trailer | `/movie/{id}/videos` |
| Cast | `/movie/{id}/credits` |
| Recommendations | `/movie/{id}/recommendations` |

## Possible next steps

- Debounced search-as-you-type
- Simple demo login (localStorage-based, no real backend) to personalize the greeting
- Dark/light theme toggle
- A real backend if you ever want Favorites/Downloads to sync across devices
