
import React from 'react';

interface TechnologyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  delay?: number;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  color = 'blue',
  delay = 0
}) => {
  const colorClasses = {
    blue: {
      shadow: 'shadow-neon-blue',
      textGlow: 'text-glow-blue',
      iconBg: 'bg-mostar-blue/10',
      border: 'border-mostar-blue/30',
      dot: 'bg-mostar-light-blue'
    },
    cyan: {
      shadow: 'shadow-neon-cyan',
      textGlow: 'text-glow-cyan',
      iconBg: 'bg-mostar-cyan/10',
      border: 'border-mostar-cyan/30',
      dot: 'bg-mostar-cyan'
    },
    green: {
      shadow: 'shadow-neon-green',
      textGlow: 'text-glow-green',
      iconBg: 'bg-mostar-green/10',
      border: 'border-mostar-green/30',
      dot: 'bg-mostar-green'
    },
    magenta: {
      shadow: 'shadow-neon-magenta',
      textGlow: 'text-glow-cyan',
      iconBg: 'bg-mostar-magenta/10',
      border: 'border-mostar-magenta/30',
      dot: 'bg-mostar-magenta'
    }
  };
  
  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div 
      className="tech-card group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top glow line */}
      <div className="glow-line top-0 left-0"></div>
      
      {/* Core content */}
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 p-3 rounded-lg ${classes.iconBg} ${classes.border}`}>
          {icon}
        </div>
        
        <div>
          <h3 className={`text-xl font-display font-bold mb-2 text-white group-hover:${classes.textGlow} transition-all duration-300`}>
            {title}
          </h3>
          <p className="text-white/70 mb-4">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-1 px-2 py-1 rounded-full ${classes.border} bg-black/20`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${classes.dot}`}></div>
                <span className="text-xs text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated details in the background */}
      <div className="absolute top-2 right-2 opacity-30 data-code">
        <div className="font-mono text-[0.6rem] text-white/40 data-scroll">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="my-1">
              {`> ${title.split(' ')[0].toLowerCase()}_module.init();`}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom glow line */}
      <div className="glow-line bottom-0 right-0"></div>
    </div>
  );
};

export default TechnologyCard;
