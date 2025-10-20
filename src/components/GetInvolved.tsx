
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const GetInvolved = () => {
  const [email, setEmail] = useState('');
  const [audienceType, setAudienceType] = useState('investor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Request Received",
      description: "Your request has been submitted successfully. We will contact you soon.",
      variant: "default",
    });
    
    setEmail('');
  };

  return (
    <section id="get-involved" className="py-16 md:py-20 clip-path-slant relative overflow-hidden">
      {/* Background with futuristic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mostar-blue/20 via-mostar-dark to-mostar-purple/20 z-0"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 md:mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-mostar-green/10 text-mostar-green font-mono text-xs mb-3">
              JOIN THE REVOLUTION
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-blue-green-gradient text-gradient">
              Get Involved
            </h2>
            <p className="max-w-2xl mx-auto text-white/70">
              Whether you're an investor, researcher, or developer, there's a place for you in the future of AI intelligence.
            </p>
          </div>

          <div className="glassmorphism rounded-lg border border-white/10 p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-white">
                  How You Can Join
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-mostar-blue/10 border border-mostar-blue/30 text-mostar-light-blue font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-lg font-display font-bold text-white mb-1">Investors</h4>
                      <p className="text-white/70 text-sm">
                        Fund the future of intelligence and gain early access to groundbreaking AI technologies.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-mostar-cyan/10 border border-mostar-cyan/30 text-mostar-cyan font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-lg font-display font-bold text-white mb-1">Researchers</h4>
                      <p className="text-white/70 text-sm">
                        Collaborate on cutting-edge AI research and push the boundaries of what's possible.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-mostar-green/10 border border-mostar-green/30 text-mostar-green font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-lg font-display font-bold text-white mb-1">Developers</h4>
                      <p className="text-white/70 text-sm">
                        Build on our platform and create the next generation of AI-powered applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-white">
                  Register Interest
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2" htmlFor="audience-type">
                        I am interested as a:
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['investor', 'researcher', 'developer'].map((type) => (
                          <div
                            key={type}
                            onClick={() => setAudienceType(type)}
                            className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 capitalize ${
                              audienceType === type
                                ? 'bg-mostar-blue/20 border-mostar-blue/50 text-mostar-light-blue'
                                : 'border-white/10 text-white/50 hover:border-white/30'
                            }`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2" htmlFor="email">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mostar-blue/50"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          type="submit"
                          className="button-cyber shadow-neon-blue py-3 md:py-4 flex items-center justify-center space-x-2 flex-grow"
                        >
                          <span>Get Early Access</span>
                          <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <Link 
                          to="/hub"
                          className="button-cyber shadow-neon-blue py-3 md:py-4 flex items-center justify-center space-x-2 flex-grow"
                        >
                          <Zap className="h-5 w-5 mr-2" />
                          <span>MoStar AI</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
