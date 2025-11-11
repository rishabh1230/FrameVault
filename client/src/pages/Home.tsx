import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Star } from 'lucide-react';
import FilmCard from '../components/FilmCard';
import { useDynamicFilms } from '../data/films';

const Home: React.FC = () => {
  const films = useDynamicFilms();
  const featuredFilms = films ? films.filter(film => film.featured) : [];

  return (
    <div className="bg-cinema-bg text-cinema-text-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(18,18,18,0.8), rgba(18,18,18,0.4)), url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg)`
          }}
        />

        {/* Geometric overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 border-2 border-cinema-accent rotate-45 opacity-20"></div>
          <div className="absolute bottom-32 left-16 w-64 h-64 bg-cinema-accent opacity-10 rotate-12"></div>
        </div>

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-6xl">
            <div className="mb-8">
              <div className="text-cinema-accent text-sm uppercase tracking-[0.3em] font-bold mb-4">
                FILM COLLECTION
              </div>
              <h1 className="text-7xl md:text-9xl font-black leading-none mb-6 tracking-tight font-montserrat cinema-bg">
                Frame
                <span className="block text-cinema-accent font-montserrat cinema-bg ">Vault</span>
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div>
                <p className="text-xl md:text-2xl font-light leading-relaxed text-cinema-text-secondary mb-8">
                  Curating cinema's most important works. 
                  <span className="text-xl md:text-2xl font-light leading-relaxed text-cinema-text-secondary mb-8"> Experience films as their creators intended.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/films"
                    className="group bg-cinema-accent text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-cinema-text-primary hover:text-cinema-bg transition-all duration-300 flex items-center justify-center"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Films */}
      <section className="py-24 bg-cinema-card">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-cinema-text-primary mb-4 font-montserrat cinema-bg">
                  FEATURED
                  <span className="block text-cinema-accent font-montserrat cinema-bg">FILMS</span>
                </h2>
                <div className="w-24 h-1 bg-cinema-accent"></div>
              </div>

              <Link 
                to="/films"
                className="hidden md:flex items-center text-cinema-text-primary hover:text-cinema-accent transition-colors group"
              >
                <span className="text-lg font-medium mr-2">View All</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {featuredFilms.slice(0, 4).map((film) => (
              <div key={film.id} className="group">
                <div className="relative overflow-hidden mb-4">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-cinema-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wide ">
                      #KK{film.criterionNumber}
                    </div>
                  </div>
                  <FilmCard film={film} />
                </div>

                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="text-cinema-accent" size={16} />
                    <span className="text-xs uppercase tracking-wide text-cinema-text-secondary">Featured</span>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-cinema-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-transparent to-cinema-bg opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-cinema-text-primary mb-8 leading-tight font-montserrat cinema-bg">
              PRESERVING CINEMA
              <span className="block text-cinema-accent font-montserrat cinema-bg">FOR FUTURE GENERATIONS</span>
            </h2>

            <p className="text-xl text-cinema-text-secondary leading-relaxed mb-8">
              We believe that Indian cinema is an art form worthy of the highest level of respect and care.
              Every release in our collection represents a commitment to quality, authenticity, and 
              the preservation of India's rich cinematic heritage across all languages and regions.
            </p>

            <Link 
              to="/about"
              className="inline-block bg-cinema-text-primary text-cinema-bg px-8 py-4 font-bold uppercase tracking-wider hover:bg-cinema-accent transition-colors font-montserrat cinema-bg"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
