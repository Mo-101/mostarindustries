
import React, { useEffect, useRef } from 'react';

const Globe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawGlobe();
    };
    
    // Globe parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Draw the globe
    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Globe center position
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;
      
      // Draw globe base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      
      // Create gradient for globe
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, 'rgba(30, 64, 175, 0.4)');
      gradient.addColorStop(0.5, 'rgba(23, 37, 84, 0.6)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw grid lines (latitude)
      ctx.strokeStyle = 'rgba(51, 161, 255, 0.3)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < 10; i++) {
        const lineRadius = (radius / 10) * (i + 1);
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw grid lines (longitude)
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI / 6) * i;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle)
        );
        ctx.stroke();
      }
      
      // Draw random data points
      ctx.fillStyle = '#4CC9F0';
      
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const size = Math.random() * 3 + 1;
        
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect to some points
        if (Math.random() > 0.7) {
          ctx.shadowColor = '#4CC9F0';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      
      // Draw connecting lines between some points
      ctx.strokeStyle = 'rgba(51, 161, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      const points = [];
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.9;
        points.push({
          x: centerX + distance * Math.cos(angle),
          y: centerY + distance * Math.sin(angle)
        });
      }
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (Math.random() > 0.8) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Rotating outer ring
      const time = Date.now() / 3000;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        centerX, 
        centerY, 
        radius + 15, 
        time % (Math.PI * 2), 
        (time % (Math.PI * 2)) + Math.PI
      );
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(114, 9, 183, 0.5)';
      ctx.beginPath();
      ctx.arc(
        centerX, 
        centerY, 
        radius + 15, 
        (time % (Math.PI * 2)) + Math.PI, 
        (time % (Math.PI * 2)) + Math.PI * 2
      );
      ctx.stroke();
    };
    
    // Animation loop
    const animate = () => {
      drawGlobe();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-full glassmorphism border border-white/10"
    />
  );
};

export default Globe;
