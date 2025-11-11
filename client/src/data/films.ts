import React, { useEffect, useState } from 'react';
import { Film } from '../types/Film'; // Your Film type definition

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper for director name formatting
function toTitleCase(name: string) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Fetch movie by IMDb ID using TMDb find endpoint
async function getMovieByImdbId(imdbId: string) {
  const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.movie_results && data.movie_results[0]) || null;
}

// Fetch movie by title and optionally year
async function getMovieByTitle(title: string, year?: number) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  const matched = data.results.find((movie: any) => {
    const titleMatches = movie.title.toLowerCase() === title.toLowerCase();
    const yearMatches = year ? new Date(movie.release_date).getFullYear() === year : true;
    return titleMatches && yearMatches;
  });

  return matched || data.results[0];
}

// Fetch movie details including credits
async function getMovieDetails(tmdbId: number) {
  const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
  const res = await fetch(url);
  return res.json();
}

export const useDynamicFilms = () => {
  const [films, setFilms] = useState<Film[] | null>(null);

  useEffect(() => {
    const baseFilms = [
      { id: 1, title: "Aaranya Kaandam", criterionNumber: 1, featured: true, year: 2010, imdbId: "tt1496729" },
      { id: 2, title: "Tumbbad", criterionNumber: 2, featured: true, year: 2018, imdbId: "tt8239946" },
      { id: 3, title: "Rocky", criterionNumber: 3, featured: true, year: 1976, imdbId: "tt11772600" },
      { id: 4, title: "Udta Punjab", criterionNumber: 4, year: 2016, imdbId: "tt3952160" },
      { id: 5, title: "Kuruthipunal", criterionNumber: 5, year: 1995, imdbId: "tt0285665" },
      { id: 6, title: "Kumbalangi Nights", criterionNumber: 6, featured: true, year: 2019, imdbId: "tt8413338" },
      { id: 7, title: "Manichitrathazhu", criterionNumber: 7, year: 1993, imdbId: "tt0214915" },
      { id: 8, title: "Trance", criterionNumber: 8, featured: true, year: 2020, imdbId: "tt6720802" },
    ];

    (async () => {
      const loadedFilms: Film[] = [];

      for (const base of baseFilms) {
        let found: any = null;

        if (base.imdbId) {
          found = await getMovieByImdbId(base.imdbId);
        }

        if (!found) {
          found = await getMovieByTitle(base.title, base.year);
        }

        if (!found) continue;

        const details = await getMovieDetails(found.id);
        const directors = details.credits.crew.filter((c: any) => c.job === "Director");
        const directorNames = directors.map((d: any) => toTitleCase(d.name)).join(', ');

        loadedFilms.push({
          id: base.id,
          title: details.title,
          director: directorNames,
          year: new Date(details.release_date).getFullYear(),
          country: details.production_countries?.[0]?.name || '',
          runtime: details.runtime,
          genre: details.genres.map((g: any) => g.name),
          description: details.overview,
          image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
          criterionNumber: base.criterionNumber,
          awards: [],
          cast: details.credits.cast.slice(0, 4).map((a: any) => a.name),
          format: '',
          language: details.spoken_languages?.[0]?.name || '',
          featured: !!base.featured,
        });
      }

      setFilms(loadedFilms);
    })();
  }, []);

  return films;
};
