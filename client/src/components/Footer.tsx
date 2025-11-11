import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-bg text-cinema-text-primary">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-cinema-accent text-white p-3 mr-4">
                <Film size={32} />
              </div>
              <div>
                <div className="text-3xl font-black tracking-tight">FrameVault</div>
              </div>
            </div>
            
            <p className="text-xl text-cinema-text-secondary leading-relaxed mb-8 max-w-lg">
              Dedicated to gathering the greatest Indian films and presenting them 
              in editions of the highest technical quality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="border-2 border-cinema-text-secondary text-cinema-text-primary px-6 py-3 font-bold uppercase tracking-wide hover:border-cinema-accent hover:text-cinema-accent transition-colors">
                Follow Us
              </button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/films" className="text-lg font-black uppercase tracking-wide text-cinema-accent hover:text-cinema-text-primary transition-colors flex items-center group font-montserrat cinema-bg">
              <span>Browse the Collection</span>
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={16} />
            </Link>
            
            <Link to="/about" className="text-lg font-black uppercase tracking-wide text-cinema-accent hover:text-cinema-text-primary transition-colors flex items-center group font-montserrat cinema-bg">
              <span>About us</span>
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={16} />
            </Link>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-cinema-card pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cinema-text-secondary text-sm mb-4 md:mb-0">
              © 2024 The FrameVault Collection. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-8 text-sm">
              <a href="#" className="text-cinema-text-secondary hover:text-cinema-text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-cinema-text-secondary hover:text-cinema-text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-cinema-text-secondary hover:text-cinema-text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;