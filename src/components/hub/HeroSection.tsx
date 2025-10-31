
import React from 'react';
import { Terminal, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-10 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-mostar-dark z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src="/lovable-uploads/921f3ba2-a0ad-401c-9c33-566f0fae3618.png" 
              alt="Mostar AI Logo" 
              className="w-20 h-20 rounded-full border-2 border-mostar-light-blue/30"
            />
            <span className="inline-block px-3 py-1 rounded-full bg-mostar-magenta/10 text-mostar-magenta font-mono text-xs">
              CLASSIFIED ACCESS
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-blue-magenta-gradient text-gradient">
            MoStar Hub <span className="text-mostar-light-blue">AI Nexus</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl">
            The intelligence epicenter where global analytics, cyber intelligence, and quantum computing technologies converge for unprecedented insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="button-cyber flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>Access Terminal</span>
            </button>
            <button className="bg-transparent border border-mostar-light-blue/30 text-mostar-light-blue px-6 py-3 rounded font-display text-sm uppercase tracking-wide hover:bg-mostar-light-blue/10 transition-colors flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security Protocols</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
