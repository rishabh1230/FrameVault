import React from 'react';
import { Link } from 'react-router-dom';
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
      className={`group block ${sizeClasses[size]}`}
    >
      {/* Poster */}
      <div className="relative overflow-hidden bg-cinema-bg aspect-[3/4] mb-4 flex items-center justify-center">
        <img
          src={film.image}
          alt={film.title}
          className="max-w-full max-h-full object-contain"
        />

        {/* 🔖 Bookmark Badge (Replaces Rectangle & Removes Stars) */}
        {film.criterionNumber && (
  <div className="absolute top-4 left-4 bg-gradient-to-br from-cinema-bg/70 to-cinema-bg/40 backdrop-blur-sm text-cinema-accent border border-cinema-accent/40 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-md">
    #{film.criterionNumber}
  </div>
)}
      </div>

      {/* Info */}
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

      {/* Bookmark CSS */}
      <style>{`
        .clip-bookmark {
          clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
        }
      `}</style>
    </Link>
  );
};

export default FilmCard;
