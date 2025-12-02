import React, { useEffect } from 'react';
import { Award, Film, Users, Globe, Target, Heart } from 'lucide-react';

const About: React.FC = () => {

  // 3D Tilt Effect + Smooth Hover
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      const el = card as HTMLElement;

      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // smoother tilt + slight scale
        const rotateX = (y / 25).toFixed(2);
        const rotateY = (-x / 25).toFixed(2);

        el.style.transform = `
          scale(1.07)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      };

      const reset = () => {
        el.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", reset);
    });

    return () => {
      cards.forEach((card) => {
        const el = card as HTMLElement;
        el.style.transform = "";
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text-primary">

      {/* Smooth hover + shadow utility */}
      <style>
        {`
          .tilt-card {
            transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
                        box-shadow 450ms ease;
          }
          .tilt-card:hover {
            box-shadow: 0 28px 45px rgba(0, 0, 0, 0.35);
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-accent via-transparent to-transparent opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 border-2 border-cinema-accent rotate-45 opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="text-cinema-accent text-sm uppercase tracking-[0.3em] font-bold mb-6 ">
              ABOUT FrameVault
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-cinema-text-primary mb-8 leading-none font-montserrat cinema-bg">
              CURATED
              <span className="block text-cinema-accent font-montserrat cinema-bg">CINEMA</span>
            </h1>
            <p className="text-2xl text-cinema-text-secondary leading-relaxed max-w-3xl">
              Celebrating the finest in Indian cinema and publishing them in editions of the highest technical quality.
              <span className="text-2xl text-cinema-text-secondary leading-relaxed max-w-3xl"> Preserving regional masterpieces for global audiences.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-cinema-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-cinema-text-primary mb-8 leading-tight font-montserrat cinema-bg">
                OUR
                <span className="block text-cinema-accent font-montserrat cinema-bg">MISSION</span>
              </h2>
              
              <div className="space-y-6 text-lg text-cinema-text-secondary leading-relaxed">
                <p>
                  FrameVault is dedicated to preserving and reintroducing India’s cinematic heritage through meticulous 4K restorations and world-class physical releases.
                </p>
                <p>
                  Our mission is to bridge the gap between forgotten film artistry and modern audiences—combining archival care, technical excellence, and curated storytelling to give every classic the timeless home it deserves.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-cinema-accent text-white p-12 relative z-10 tilt-card">
                <div className="text-6xl font-black mb-4">8</div>
                <div className="text-lg font-bold uppercase tracking-wide mb-4 font-montserrat cinema-bg">Curated Films</div>
                <p className="text-sm leading-relaxed">
                  Carefully selected masterpieces from across Indian cinema's rich landscape.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-cinema-text-secondary"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-cinema-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-cinema-text-primary mb-4 font-montserrat cinema-bg">
              BY THE
              <span className="block text-cinema-accent font-montserrat cinema-bg">NUMBERS</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            
            <div className="text-center group">
              <div className="bg-cinema-card p-8 tilt-card">
                <Film size={48} className="mx-auto mb-4" />
                <div className="text-4xl font-black mb-2">8</div>
                <div className="text-sm uppercase tracking-wide font-bold">Films Released</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-cinema-card p-8 tilt-card">
                <Award size={48} className="mx-auto mb-4" />
                <div className="text-4xl font-black mb-2">0</div>
                <div className="text-sm uppercase tracking-wide font-bold">Years of Excellence</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-cinema-card p-8 tilt-card">
                <Globe size={48} className="mx-auto mb-4" />
                <div className="text-4xl font-black mb-2">24+</div>
                <div className="text-sm uppercase tracking-wide font-bold">Languages & Regions</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-cinema-card p-8 tilt-card">
                <Users size={48} className="mx-auto mb-4" />
                <div className="text-4xl font-black mb-2">2M+</div>
                <div className="text-sm uppercase tracking-wide font-bold">Film Enthusiasts</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-cinema-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-cinema-text-primary mb-4 font-montserrat cinema-bg">
              OUR
              <span className="block text-cinema-accent font-montserrat cinema-bg">VALUES</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="text-center group">
              <div className="bg-cinema-bg p-8 border-2 border-cinema-text-secondary min-h-[325px] tilt-card">
                <div className="w-20 h-20 bg-cinema-accent text-white flex items-center justify-center mx-auto mb-6 ">
                  <Target size={36} />
                </div>
                <h3 className="text-2xl font-black text-cinema-text-primary mb-4 uppercase tracking-wide">Quality</h3>
                <p className="text-cinema-text-secondary leading-relaxed">
                  We are committed to the highest standards of technical quality and restoration, 
                  ensuring films are presented as their creators intended.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-cinema-bg p-8 border-2 border-cinema-text-secondary tilt-card">
                <div className="w-20 h-20 bg-cinema-accent text-white flex items-center justify-center mx-auto mb-6 ">
                  <Globe size={36} />
                </div>
                <h3 className="text-2xl font-black text-cinema-text-primary mb-4 uppercase tracking-wide">Cultural Revival</h3>
                <p className="text-cinema-text-secondary leading-relaxed">
                  Great films shouldn’t be lost to time or geography. We bring forgotten films, voices, and 
                  aesthetics back into the cultural conversation—reviving not just movies, but the creative eras they represent.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-cinema-bg p-8 border-2 border-cinema-text-secondary tilt-card">
                <div className="w-20 h-20 bg-cinema-accent text-white flex items-center justify-center mx-auto mb-6">
                  <Heart size={36} />
                </div>
                <h3 className="text-2xl font-black text-cinema-text-primary mb-4 uppercase tracking-wide">Curation</h3>
                <p className="text-cinema-text-secondary leading-relaxed">
                 We make India’s cinematic gems accessible to a global audience, curating each title with thoughtful
                 context—subtitles, essays, and cultural insight—so new viewers can rediscover them meaningfully
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-cinema-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 flex justify-center opacity-10 pointer-events-none">
          <div className="w-1/2 h-full bg-cinema-bg"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight font-montserrat">
            GET IN
            <span className="block font-montserrat">TOUCH</span>
          </h2>

          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Have questions about our collection or want to learn more about The FrameVault Collection?  
            We'd love to hear from you.
          </p>

          <div className="flex justify-center">
            <button className="bg-cinema-bg text-cinema-text-primary px-8 py-4 font-bold uppercase tracking-wide hover:bg-cinema-card transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
