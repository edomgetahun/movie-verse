import { useEffect, useState } from 'react';

import type { Movie } from '../types/movie';

import { getTrending, BACKDROP_BASE } from '../services/tmdb';

import { useMovieModal } from '../context/MovieModalContext';



export default function Hero() {

  const [movie, setMovie] = useState<Movie | null>(null);

  const { openMovie } = useMovieModal();



  useEffect(() => {

    getTrending().then((movies) => {

      const withBackdrop = movies.find((m) => m.backdrop_path);

      setMovie(withBackdrop || movies[0] || null);

    });

  }, []);



  if (!movie) {

    return <div className="hero hero-loading" />;

  }



  return (

    <section

      className="hero"

      style={{

        backgroundImage: movie.backdrop_path ? `url(${BACKDROP_BASE}${movie.backdrop_path})` : undefined,

      }}

    >

      <div className="hero-overlay">

        <p className="hero-eyebrow">Trending Now</p>

        <h1>{movie.title}</h1>

        <p className="hero-sub">

          {movie.overview.slice(0, 180)}

          {movie.overview.length > 180 ? '…' : ''}

        </p>

        <div className="hero-actions">

          <button className="btn-primary" onClick={() => openMovie(movie.id)}>

            ▶ Play Trailer

          </button>

          <button className="btn-secondary" onClick={() => openMovie(movie.id)}>

            ℹ More Info

          </button>

        </div>

      </div>

    </section>

  );

}