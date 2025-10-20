
import React from 'react';
import { Brain, Shield, Database, Satellite, Globe } from 'lucide-react';

const VisionSection = () => {
  const partners = [
    'NASA', 'ESA', 'Copernicus', 'OpenAI', 'Microsoft AI', 'Oracle', 'Sentinel'
  ];

  const ecosystemItems = [
    {
      icon: <Shield className="h-8 w-8 text-mostar-light-blue" />,
      title: 'Autonomous AI Security',
      description: 'Self-evolving security systems that adapt to threats in real-time, creating impenetrable defense layers.'
    },
    {
      icon: <Brain className="h-8 w-8 text-mostar-magenta" />,
      title: 'Predictive Intelligence',
      description: 'Next-generation algorithms that anticipate threats before they emerge with unparalleled accuracy.'
    },
    {
      icon: <Globe className="h-8 w-8 text-mostar-cyan" />,
      title: 'Planetary Monitoring',
      description: 'Global surveillance systems that track environmental patterns and geopolitical developments continuously.'
    },
    {
      icon: <Database className="h-8 w-8 text-mostar-green" />,
      title: 'Quantum Data Processing',
      description: 'Leveraging quantum computing principles to process petabytes of data in milliseconds.'
    },
    {
      icon: <Satellite className="h-8 w-8 text-mostar-yellow" />,
      title: 'Orbital AI Networks',
      description: 'Satellite-based AI systems providing global coverage and immune to terrestrial disruptions.'
    }
  ];

  return (
    <section id="vision" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-mostar-blue/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-mostar-cyan/10 text-mostar-cyan font-mono text-xs mb-3">
            THE HORIZON
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-cyan-green-gradient text-gradient">
            Our Vision
          </h2>
          <p className="max-w-2xl mx-auto text-white/70">
            We're engineering the future of global intelligence systems that merge human insight with AI capabilities.
          </p>
        </div>

        {/* AI Ecosystem Visualization */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative">
            {/* Central Hub */}
            <div className="relative z-20 glassmorphism mx-auto w-60 h-60 rounded-full flex items-center justify-center border border-white/10 mb-10">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-cyber-grid bg-[length:10px_10px] opacity-20"></div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold bg-blue-magenta-gradient text-gradient mb-2">
                  MoStar AI
                </div>
                <div className="text-white/70 text-sm">
                  Intelligent Ecosystem
                </div>
              </div>
              
              {/* Animated orbit */}
              <div className="absolute inset-[-20px] border border-dashed border-mostar-blue/20 rounded-full animate-rotate-slow"></div>
              <div className="absolute inset-[-40px] border border-dashed border-mostar-cyan/20 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
              <div className="absolute inset-[-60px] border border-dashed border-mostar-magenta/20 rounded-full animate-rotate-slow"></div>
            </div>
            
            {/* Connected Technologies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ecosystemItems.slice(0, 3).map((item, index) => (
                <div 
                  key={index}
                  className="glassmorphism p-6 rounded-lg border border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-white/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:px-16">
              {ecosystemItems.slice(3).map((item, index) => (
                <div 
                  key={index}
                  className="glassmorphism p-6 rounded-lg border border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-white/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-display font-bold mb-8 text-white">
            Strategic Partnerships
          </h3>
          
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="glassmorphism px-5 py-3 rounded-full border border-white/10 flex items-center justify-center min-w-[120px]"
              >
                <span className="text-white font-display">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
