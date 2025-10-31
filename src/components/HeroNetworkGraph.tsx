import React, { useEffect, useRef } from 'react';

type OrbitPoint = {
  radius: number;
  baseAngle: number;
  speed: number;
  size: number;
  pulseSpeed: number;
};

const ORBIT_POINT_COUNT = 68;
const RING_COUNT = 6;
const SPOKE_COUNT = 24;

const createOrbitPoints = (): OrbitPoint[] =>
  Array.from({ length: ORBIT_POINT_COUNT }, () => ({
    radius: 30 + Math.random() * 140,
    baseAngle: Math.random() * Math.PI * 2,
    speed: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
    size: Math.random() * 2.6 + 1,
    pulseSpeed: Math.random() * 0.6 + 0.2,
  }));

const drawRadialGrid = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  maxRadius: number,
) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(76, 201, 240, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);

  for (let ring = 1; ring <= RING_COUNT; ring += 1) {
    const radius = (maxRadius / RING_COUNT) * ring;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  const spokeAngle = (Math.PI * 2) / SPOKE_COUNT;
  for (let spoke = 0; spoke < SPOKE_COUNT; spoke += 1) {
    const angle = spoke * spokeAngle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + cos * maxRadius, centerY + sin * maxRadius);
    ctx.stroke();
  }

  ctx.restore();
};

const drawHalo = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
  const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.6, `${color}40`);
  gradient.addColorStop(1, `${color}00`);

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const HeroNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const points = createOrbitPoints();
    let animationFrameId = 0;
    const startTime = performance.now();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });

    resizeObserver.observe(container);

    const renderFrame = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / 1000;
      const { width, height } = canvas;
      const centerX = width / (2 * (window.devicePixelRatio || 1));
      const centerY = height / (2 * (window.devicePixelRatio || 1));
      const maxRadius = Math.min(centerX, centerY) * 0.9;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawHalo(ctx, centerX, centerY, maxRadius * 1.1, '#132735');
      drawRadialGrid(ctx, centerX, centerY, maxRadius);

      const orbitGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      orbitGradient.addColorStop(0, 'rgba(76, 201, 240, 0.25)');
      orbitGradient.addColorStop(0.5, 'rgba(53, 153, 255, 0.1)');
      orbitGradient.addColorStop(1, 'rgba(53, 153, 255, 0)');

      ctx.save();
      ctx.fillStyle = orbitGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      points.forEach((point, index) => {
        const angle = point.baseAngle + elapsed * point.speed;
        const radius = point.radius * (0.96 + Math.sin(elapsed * point.pulseSpeed + index) * 0.02);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const pulse = 0.6 + (Math.sin(elapsed * (0.8 + point.pulseSpeed) + index) + 1) * 0.2;
        const size = point.size * pulse;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(82, 211, 255, 0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(82, 211, 255, 0.8)';
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      drawHalo(ctx, centerX, centerY, maxRadius * 0.32, 'rgba(76, 201, 240, 0.45)');
      drawHalo(ctx, centerX, centerY, maxRadius * 0.1, 'rgba(255, 255, 255, 0.8)');

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden"><canvas ref={canvasRef} className="h-full w-full" /></div>;
};

export default HeroNetworkGraph;
