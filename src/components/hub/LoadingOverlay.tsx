
import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content flex flex-col items-center">
        <div className="loading-logo"></div>
        <div className="mt-8 font-display text-2xl text-mostar-light-blue text-glow-blue">
          MOSTAR HUB
        </div>
        <div className="mt-2 font-mono text-xs text-white/70">
          INITIALIZING AI NEXUS...
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
