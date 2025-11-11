import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Film } from '../types/Film';

interface FilmCardProps {
  film: Film;
  size?: 'small' | 'medium' | 'large';
}

const FilmCard: React.FC<FilmCardProps> = ({ film, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-full max-w-48',
    medium: 'w-full max-w-64',
    large: 'w-full max-w-80',
  };

  return (
    <Link
      to={`/film/${film.id}`}
      className={`group block ${sizeClasses[size]} transform transition-all duration-500 hover:scale-105`}
    >
      {/* Poster Section */}
      <div className="relative overflow-hidden bg-cinema-card aspect-[3/4] mb-4">
        <img
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-cinema-bg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Play Button */}
        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-cinema-accent text-white p-4 rounded-full transition-transform duration-300 transform scale-75 group-hover:scale-100">
            <Play size={24} fill="currentColor" />
          </div>
        </div> */}

        {/* Criterion Number */}
        {film.criterionNumber && (
          <div className="absolute top-4 left-4 bg-cinema-bg bg-opacity-80 text-cinema-accent text-xs font-bold px-3 py-1 uppercase tracking-wide">
            #{film.criterionNumber}
          </div>
        )}

        {/* Featured Badge */}
        {film.featured && (
          <div className="absolute top-4 right-4 bg-cinema-accent text-white p-1 rounded-full">
            <Star size={16} fill="currentColor" />
          </div>
        )}
      </div>

      {/* Info Section (only shown once) */}
      <div className="space-y-2 px-2">
        <h3 className="font-black text-lg text-cinema-text-primary leading-tight truncate font-montserrat cinema-bg">
          {film.title}
        </h3>
        <p className="text-sm text-cinema-text-secondary tracking-wide line-clamp-1">
          {film.director} • {film.year}
        </p>
        <p className="text-xs text-cinema-text-secondary opacity-75 uppercase tracking-wide">
          {film.country} • {film.runtime} min
        </p>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {film.genre.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-cinema-card text-cinema-text-secondary text-xs font-medium uppercase tracking-wide"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default FilmCard;
