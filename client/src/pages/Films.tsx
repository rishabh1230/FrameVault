import React, { useState, useMemo } from 'react';
import { Filter, Search } from 'lucide-react';
import FilmCard from '../components/FilmCard';
import { useDynamicFilms } from '../data/films';

const Films: React.FC = () => {
  const films = useDynamicFilms();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('year');
  const [showFilters, setShowFilters] = useState(false);

  const genres = useMemo(() => {
    if (!films) return [];
    const allGenres = films.flatMap(film => film.genre);
    return Array.from(new Set(allGenres)).sort();
  }, [films]);

  const countries = useMemo(() => {
    if (!films) return [];
    const allCountries = films.map(film => film.country);
    return Array.from(new Set(allCountries)).sort();
  }, [films]);

  const filteredAndSortedFilms = useMemo(() => {
    if (!films) return [];

    let filtered = films;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(film => film.genre.includes(selectedGenre));
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(film => film.country === selectedCountry);
    }

    return filtered.slice().sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'director':
          return a.director.localeCompare(b.director);
        case 'year':
        default:
          return b.year - a.year;
      }
    });
  }, [films, selectedGenre, selectedCountry, sortBy]);

  if (!films) {
    return (
      <div className="min-h-screen bg-cinema-bg text-cinema-text-primary flex items-center justify-center">
        Loading films...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="mb-8">
            <div className="text-cinema-accent text-sm uppercase tracking-[0.3em] font-bold mb-4 font-montserrat cinema-bg">
              FILM COLLECTION
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-cinema-text-primary mb-6 leading-none font-montserrat cinema-bg">
              CURATED
              <span className="block text-cinema-accent font-montserrat cinema-bg">CINEMA</span>
            </h1>
          </div>

          <p className="text-xl text-cinema-text-secondary max-w-3xl leading-relaxed">
            Explore our meticulously curated selection of classic and contemporary cinema,
            <span className="text-xl text-cinema-text-secondary max-w-3xl leading-relaxed">
              carefully restored and presented with the highest technical standards.
            </span>
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 bg-cinema-card hover:bg-cinema-text-secondary hover:bg-opacity-20 px-6 py-3 transition-colors group"
            >
              <Filter size={20} className="group-hover:text-cinema-accent transition-colors" />
              <span className="font-bold uppercase tracking-wide">Filters</span>
            </button>

            <div className="text-sm text-cinema-text-secondary">
              <span className="text-cinema-text-primary font-bold">{filteredAndSortedFilms.length}</span> of {films.length} films
            </div>
          </div>

          {showFilters && (
            <div className="bg-cinema-card p-8 mb-8 border-l-4 border-cinema-accent">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-cinema-text-secondary mb-3">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-cinema-bg text-cinema-text-primary border-2 border-cinema-text-secondary px-4 py-3 focus:outline-none focus:border-cinema-accent transition-colors font-medium"
                  >
                    <option value="all">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-cinema-text-secondary mb-3">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-cinema-bg text-cinema-text-primary border-2 border-cinema-text-secondary px-4 py-3 focus:outline-none focus:border-cinema-accent transition-colors font-medium"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-cinema-text-secondary mb-3">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-cinema-bg text-cinema-text-primary border-2 border-cinema-text-secondary px-4 py-3 focus:outline-none focus:border-cinema-accent transition-colors font-medium"
                  >
                    <option value="year">Year (Newest First)</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="director">Director (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Poster Size Fix */}
        <style>{`
          .fixed-poster img {
            width: 100% !important;
            height: 260px !important;
            object-fit: cover !important;
          }

          @media (min-width: 768px) {
            .fixed-poster img {
              height: 320px !important;
            }
          }
        `}</style>

        {/* FILM CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {filteredAndSortedFilms.map(film => (
            <div
              key={film.id}
              className="
                fixed-poster w-full max-w-xs
                rounded-md
                shadow-md
                px-4 pt-4 pb-6

                bg-cinema-bg

                transform transition-all duration-300 ease-out

                hover:-translate-y-2
                hover:bg-cinema-bg/10
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
              "
            >
              <FilmCard film={film} />
            </div>
          ))}
        </div>

        {filteredAndSortedFilms.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <Search size={64} className="mx-auto text-cinema-text-secondary opacity-50 mb-4" />
              <h3 className="text-2xl font-black text-cinema-text-primary mb-2">No Films Found</h3>
              <p className="text-cinema-text-secondary">Try adjusting your filters to see more results.</p>
            </div>

            <button
              onClick={() => {
                setSelectedGenre('all');
                setSelectedCountry('all');
              }}
              className="bg-cinema-accent text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-cinema-text-primary hover:text-cinema-bg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Films;
