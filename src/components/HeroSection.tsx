
import React, { useEffect, useState } from 'react';
import Globe from './Globe';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-20 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-mostar-blue/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-mostar-dark to-transparent z-10"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-mostar-blue/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-mostar-purple/10 blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-mostar-blue/10 text-mostar-light-blue font-mono text-xs mb-3">
                WELCOME TO THE FUTURE
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight mb-4">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  The Next Era of
                </span>
                <br />
                <span className="bg-gradient-to-r from-mostar-cyan via-mostar-light-blue to-mostar-blue bg-clip-text text-transparent animate-text-gradient">
                  Intelligence
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-lg">
                AI-Driven Intelligence, Geospatial Mastery, Unbreakable Security.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#get-involved" className="button-cyber shadow-neon-blue inline-flex items-center">
                Join the Future of AI
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#technologies" className="button-cyber bg-transparent hover:bg-mostar-blue/5 transition-colors">
                Discover Technologies
              </a>
            </div>
            
            {/* Floating data stats with futuristic appearance */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12">
              {[
                { label: 'AI Systems', value: '24K+' },
                { label: 'Secured Data', value: '98.7%' },
                { label: 'Global Reach', value: '140+' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`glassmorphism p-4 rounded-lg border border-white/10 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${500 + (index * 200)}ms` }}
                >
                  <div className="font-display font-bold text-2xl text-mostar-light-blue text-glow-blue">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`relative h-[500px] transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Futuristic globe visualization */}
            <Globe />
            
            {/* Data streams floating around the globe */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col glassmorphism p-3 rounded-lg shadow-neon-blue animate-float">
              <div className="text-xs font-mono text-mostar-light-blue">SECURITY ALERT</div>
              <div className="text-white/70 text-xs">Threat neutralized: 23.45.67.89</div>
            </div>
            
            <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 flex flex-col glassmorphism p-3 rounded-lg shadow-neon-green animate-float animate-delay-1000">
              <div className="text-xs font-mono text-mostar-green">DATA STREAM</div>
              <div className="text-white/70 text-xs">Processing 24.7 TB/second</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <div className="text-white/50 text-sm font-mono mb-2">SCROLL TO EXPLORE</div>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-mostar-light-blue rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
