# MovieVerse 🎬

A modern, cinema-themed movie browsing application built with React, TypeScript, Tailwind CSS, Framer Motion, and the TMDB API. Browse trending titles, search, watch trailers, jump directly to official streaming links, and persist your personal watchlist locally.

---

## ✨ Features

- **Hero Banner** — Spotlights a trending movie with backdrop artwork, dynamic metadata, and instant play controls.
- **Interactive Movie Detail Modal** — Deep dive into any movie without losing your place:
  - Embedded **YouTube Trailer** playback.
  - Animated **"Watch Now"** action that links directly to official streaming providers via JustWatch.
  - Full cast list and **"More Like This"** recommendations.
- **Genre Rows & Filters** — Browse curated feeds (Action, Sci-Fi, Marvel, etc.) and filter/sort on dedicated genre pages.
- **Search** — Instant title search across the entire TMDB database.
- **Favorites & Watchlist** — Save titles to your browser's local storage for easy access.
- **Fluid Micro-Interactions** — Smooth hover effects, modal transitions, and spring animations powered by Framer Motion.

---

## ℹ️ A Note on "Watch Now" & "Downloads"

- **Watch Now:** Redirects directly to official external streaming platforms (such as Netflix, Prime Video, Apple TV) using live TMDB provider data powered by JustWatch.
- **Downloads / Watchlist:** TMDB provides movie metadata and images, not video files. "Downloads" functions as a persistent local watchlist that behaves like an offline queue.

---

## 🛠️ Tech Stack

- **Framework & Language:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Data Source:** TMDB API (The Movie Database)
- **State & Persistence:** React Context + Browser `localStorage`

---

## 🚀 Getting Started

### 1. Get a Free TMDB API Key

1. Sign up at https://www.themoviedb.org/signup
2. Go to **Settings → API**.
3. Create a request for a **Developer** API Key.
4. Copy your **API Key (v3 auth)**.

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> **Note:** Ensure `.env` is included in your `.gitignore` file to protect your API key.

### 4. Run Development Server

```bash
npm run dev
```

Open the local URL printed in your terminal (typically `http://localhost:5173`).

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── GenreRow.tsx         # Horizontal scrolling movie collection
│   ├── Hero.tsx             # Featured homepage hero banner
│   ├── MovieCard.tsx        # Poster card with dynamic hover effects
│   ├── MovieModal.tsx       # Rich movie modal (Trailer, Streaming Links, Cast)
│   ├── Navbar.tsx           # Main site navigation
│   └── SearchBar.tsx        # Real-time search query input
├── context/
│   ├── DownloadsContext.tsx    # Manages local watchlist/downloads
│   ├── FavoritesContext.tsx    # Manages favorited movies
│   └── MovieModalContext.tsx   # Controls open modal state
├── hooks/
│   └── useLocalStorageList.ts  # Generic hook for browser persistence
├── lib/
│   └── motion.ts               # Framer Motion transition configs
├── pages/
│   ├── Downloads.tsx           # Saved watchlist view
│   ├── Favorites.tsx           # Favorites collection view
│   ├── GenrePage.tsx           # Multi-select filter and sort grid
│   ├── Home.tsx                # Main landing page feed
│   ├── MovieDetails.tsx        # Dedicated movie detail page
│   └── SearchResults.tsx       # Search results page
├── services/
│   └── tmdb.ts                 # API client & endpoint helpers
├── types/
│   └── movie.ts                # TypeScript interfaces (Movie, Cast, Providers)
├── App.tsx                     # Providers & Application routes
├── main.tsx                    # Entry point
└── index.css                   # Tailwind directives & theme configuration
```

---

## 🌐 API Reference

| Feature | TMDB Endpoint |
|---------|---------------|
| Movie Details & Providers | `/movie/{id}`, `/movie/{id}/watch/providers` |
| Trailers & Cast | `/movie/{id}/videos`, `/movie/{id}/credits` |
| Trending & Feeds | `/trending/movie/week`, `/movie/now_playing`, `/movie/upcoming` |
| Genres & Discovery | `/discover/movie` |
| Recommendations | `/movie/{id}/recommendations` |

---

## 🔮 Future Enhancements

- [ ] Backend integration with a database for user accounts and cloud storage.
- [ ] Debounced search-as-you-type in the navbar.
- [ ] User profile customization & preference syncing.
