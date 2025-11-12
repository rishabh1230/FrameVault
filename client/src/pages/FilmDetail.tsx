// client/src/pages/FilmDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Calendar, Play } from 'lucide-react';
import { toast } from 'react-toastify';
import FilmCard from '../components/FilmCard';
import { Film } from '../types/Film';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function getMovieByImdbId(imdbId: string) {
  const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.movie_results && data.movie_results[0]) || null;
}

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

async function getMovieDetails(tmdbId: number) {
  const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
  const res = await fetch(url);
  return res.json();
}

const baseFilms = [
  {
    id: 1,
    title: "Aaranya Kaandam",
    criterionNumber: 1,
    featured: true,
    year: 2010,
    imdbId: "tt1496729",
    specialFeatures: [
      "New 4K digital restoration, with original theatrical 2.0 surround DTS-HD Master Audio soundtrack",
      "Alternate 5.0 surround DTS-HD Master Audio soundtrack",
      "One 4K UHD disc of the film and one Blu-ray with the film and special features",
      "Audio commentary featuring writer-director Edward Yang and Asian-cinema critic Tony Rayns",
      "Interview with Rayns about Yang and the New Taiwan Cinema movement",
      "U.S. theatrical trailer",
      "Original English subtitle translation by Yang and Rayns",
      "PLUS: An essay by critic Kent Jones and notes from the director",
      "Cover design by Eric Skillman, photograph by Andre Constantini"
    ]
  },
  {
    id: 2,
    title: "Tumbbad",
    criterionNumber: 2,
    featured: true,
    year: 2018,
    imdbId: "tt8239946",
    specialEditionFeatures: [
      "Tumbbad: Behind the mythology",
      "Cast and crew interviews",
      "Storyboard and concept art gallery",
      "Director's notes booklet",
    ],
  },
  {
    id: 3,
    title: "Rocky",
    criterionNumber: 3,
    featured: true,
    year: 1976,
    imdbId: "tt11772600",
    specialEditionFeatures: [
      "4K remaster approved by director",
      "Original theatrical and alternate audio tracks",
      "Interview with lead actor",
      "Retrospective essay by film critic",
    ],
  },
  {
    id: 4,
    title: "Udta Punjab",
    criterionNumber: 4,
    year: 2016,
    imdbId: "tt3952160",
    specialEditionFeatures: [
      "Soundtrack CD",
      "Uncut making-of documentary",
      "Director and writing team commentary",
      "Visual effects featurette",
    ],
  },
  {
    id: 5,
    title: "Kuruthipunal",
    criterionNumber: 5,
    year: 1995,
    imdbId: "tt0285665",
    specialEditionFeatures: [
      "Rare on-set photos gallery",
      "Composer interview on scoring",
      "Cinematography deep-dive",
      "Vintage publicity booklet reproduction",
    ],
  },
  {
    id: 6,
    title: "Kumbalangi Nights",
    criterionNumber: 6,
    featured: true,
    year: 2019,
    imdbId: "tt8413338",
    specialEditionFeatures: [
      "Director and producer roundtable",
      "Production design featurette",
      "Fan art gallery",
      "Full script included as booklet",
    ],
  },
  {
    id: 7,
    title: "Manichitrathazhu",
    criterionNumber: 7,
    year: 1993,
    imdbId: "tt0214915",
    specialEditionFeatures: [
      "Interview: Legacy of Manichitrathazhu",
      "Music through the decades: Documentary",
      "Archival restoration notes",
      "Essay on cultural impact by film historian",
    ],
  },
  {
    id: 8,
    title: "Trance",
    criterionNumber: 8,
    featured: true,
    year: 2020,
    imdbId: "tt6720802",
    specialEditionFeatures: [
      "Making Trance: Feature documentary",
      "Cast Q&A panel",
      "Deleted and extended scenes",
      "Exclusive concept art booklet",
    ],
  },
];

const FilmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [films, setFilms] = useState<Film[] | null>(null);
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const loadedFilms: Film[] = [];

      for (const base of baseFilms) {
        let found: any = null;
        if (base.imdbId) found = await getMovieByImdbId(base.imdbId);
        if (!found) found = await getMovieByTitle(base.title, base.year);
        if (!found) continue;

        const details = await getMovieDetails(found.id);
        const directors = details.credits.crew.filter((c: any) => c.job === "Director");
        const directorNames = directors.map((d: any) => d.name).join(', ');

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
          format: '',
          language: details.spoken_languages?.[0]?.name || '',
          featured: !!base.featured,
          specialFeatures: (base as any).specialFeatures || (base as any).specialEditionFeatures || [],
          cast: details.credits.cast.slice(0, 5).map((c: any) => c.name),
        });
      }

      setFilms(loadedFilms);
    })();
  }, []);

  if (!films) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading films from TMDb...</p>
      </div>
    );
  }

  const film = films.find(f => f.id === parseInt(id || ''));
  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Film Not Found</h1>
          <Link to="/films" className="text-yellow-400 hover:text-white transition-colors font-medium">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please register or login to add items to your cart');
      navigate('/register');
      return;
    }
    addItemToCart(film);
    toast.success(`${film.title} added to cart!`);
  };

  const relatedFilms = films
    .filter(f => f.id !== film.id && (
      f.director === film.director ||
      f.genre.some(g => film.genre.includes(g))
    ))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text-primary">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/films"
          className="inline-flex items-center gap-3 text-cinema-text-secondary hover:text-cinema-accent transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-wide">Back to Collection</span>
        </Link>
      </div>

      {/* Criterion-style Layout */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* LEFT: Film Info */}
            <div className="space-y-8 order-2 lg:order-1 lg:ml-40">
              <h1 className="text-5xl md:text-6xl font-black text-cinema-text-primary mb-4 leading-none">
                {film.title}
              </h1>
              <p className="text-2xl text-cinema-text-secondary mb-6">
                Directed by <span>{film.director}</span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Calendar className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold">{film.year}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Year</div>
                </div>
                <div className="text-center">
                  <Clock className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold">{film.runtime}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Minutes</div>
                </div>
                <div className="text-center">
                  <Globe className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold">{film.language}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Language</div>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide mb-4">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {film.genre.map(genre => (
                    <span
                      key={genre}
                      className="bg-cinema-card text-cinema-text-primary px-4 py-2 text-sm font-bold uppercase tracking-wide border-l-4 border-cinema-accent"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide mb-4">Synopsis</h3>
                <p className="text-lg text-cinema-text-secondary leading-relaxed">{film.description}</p>
              </div>

              {/* Special Features */}
              {(film as any).specialFeatures?.length > 0 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wide mb-4">4K UHD + Blu-ray Special Edition Features</h3>
                  <ul className="list-disc list-inside text-cinema-text-secondary space-y-2">
                    {(film as any).specialFeatures.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT: Poster + Buttons */}
            <div className="flex flex-col items-center lg:items-end order-1 lg:order-2 lg:mr-40">
              <div className="relative max-w-md w-full">
                <div className="aspect-[3/4] overflow-hidden bg-cinema-card relative">
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {film.criterionNumber && (
                  <div className="absolute -top-4 -right-4 bg-cinema-accent text-white p-4 font-black text-xl">
                    #{film.criterionNumber}
                  </div>
                )}
              </div>

              {/* Buttons under image */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
                <button className="bg-cinema-accent text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-cinema-text-primary hover:text-cinema-bg transition-colors flex items-center justify-center w-full">
                  <Play className="mr-2" size={20} />
                  Watch Trailer
                </button>
                <button
                  onClick={handleAddToCart}
                  className="border-2 border-cinema-text-secondary text-cinema-text-primary px-8 py-4 font-bold uppercase tracking-wide hover:border-cinema-accent hover:text-cinema-accent transition-colors w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 Swipeable Related Films */}
      {relatedFilms.length > 0 && (
        <section className="py-24 bg-cinema-card">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-cinema-text-primary mb-4">
                RELATED
                <span className="block text-cinema-accent">FILMS</span>
              </h2>
              <div className="w-24 h-1 bg-cinema-accent"></div>
            </div>

            {/* Horizontal scroll layout */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 snap-x snap-mandatory px-1">
                {relatedFilms.map((relatedFilm) => (
                  <div
                    key={relatedFilm.id}
                    className="group flex-shrink-0 w-72 snap-center transition-transform hover:scale-105 duration-300"
                  >
                    <FilmCard film={relatedFilm} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FilmDetail;
