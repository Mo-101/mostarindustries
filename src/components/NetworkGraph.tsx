import React, { useEffect, useRef, useState } from 'react';

type Layer = 'soul' | 'mind' | 'body' | 'meta';

type AgentNode = {
  id: string;
  name: string;
  layer: Layer;
  color: string;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  pulse: number;
  floatAmplitude: number;
  floatSpeed: number;
  floatOffset: number;
  connections: string[];
};

type DataNode = {
  id: string;
  anchorId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulse: number;
  color: string;
};

type Connection = {
  source: string;
  target: string;
  strength: number;
};

type HoverDetails = {
  id: string;
  name: string;
  layer: Layer;
  connections: number;
};

const AGENT_BLUEPRINTS: Omit<AgentNode, 'x' | 'y' | 'pulse' | 'floatAmplitude' | 'floatSpeed' | 'floatOffset'>[] = [
  {
    id: 'deepcal-core',
    name: 'DeepCAL Core',
    layer: 'mind',
    color: '#4CC9F0',
    baseX: 0,
    baseY: 0,
    size: 26,
    connections: ['assessor', 'oracle', 'judge', 'executor', 'phoenix'],
  },
  {
    id: 'overlord',
    name: 'Overlord',
    layer: 'soul',
    color: '#FFD700',
    baseX: -95,
    baseY: -60,
    size: 22,
    connections: ['deepcal-core', 'woo', 'executor', 'assessor', 'phoenix'],
  },
  {
    id: 'assessor',
    name: 'Assessor',
    layer: 'mind',
    color: '#4361EE',
    baseX: 110,
    baseY: -20,
    size: 18,
    connections: ['deepcal-core', 'judge', 'tsatse-fly', 'radx-flb'],
  },
  {
    id: 'oracle',
    name: 'Oracle',
    layer: 'mind',
    color: '#3A0CA3',
    baseX: 140,
    baseY: 90,
    size: 18,
    connections: ['deepcal-core', 'judge'],
  },
  {
    id: 'judge',
    name: 'Judge',
    layer: 'mind',
    color: '#7209B7',
    baseX: 30,
    baseY: 130,
    size: 20,
    connections: ['deepcal-core', 'assessor', 'oracle', 'executor'],
  },
  {
    id: 'tsatse-fly',
    name: 'TsaTse Fly',
    layer: 'mind',
    color: '#B5179E',
    baseX: -140,
    baseY: 120,
    size: 16,
    connections: ['assessor', 'radx-flb'],
  },
  {
    id: 'executor',
    name: 'Executor',
    layer: 'body',
    color: '#06D6A0',
    baseX: -70,
    baseY: -150,
    size: 19,
    connections: ['deepcal-core', 'judge', 'code-conduit', 'radx-flb', 'overlord'],
  },
  {
    id: 'code-conduit',
    name: 'Code Conduit',
    layer: 'body',
    color: '#0DB39E',
    baseX: -180,
    baseY: -60,
    size: 16,
    connections: ['executor'],
  },
  {
    id: 'woo',
    name: 'Woo',
    layer: 'soul',
    color: '#FF6B35',
    baseX: 80,
    baseY: -140,
    size: 18,
    connections: ['overlord', 'flameborn-writer'],
  },
  {
    id: 'flameborn-writer',
    name: 'Flameborn Writer',
    layer: 'soul',
    color: '#FF8C42',
    baseX: 170,
    baseY: -120,
    size: 16,
    connections: ['woo'],
  },
  {
    id: 'radx-flb',
    name: 'RAD-X-FLB',
    layer: 'meta',
    color: '#F72585',
    baseX: -180,
    baseY: 60,
    size: 22,
    connections: ['assessor', 'executor', 'tsatse-fly'],
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    layer: 'meta',
    color: '#E63946',
    baseX: 160,
    baseY: 160,
    size: 16,
    connections: ['deepcal-core', 'overlord'],
  },
];

const CONNECTIONS: Connection[] = [
  { source: 'deepcal-core', target: 'assessor', strength: 2.2 },
  { source: 'deepcal-core', target: 'oracle', strength: 2 },
  { source: 'deepcal-core', target: 'judge', strength: 2.8 },
  { source: 'deepcal-core', target: 'executor', strength: 2.4 },
  { source: 'deepcal-core', target: 'phoenix', strength: 1.2 },
  { source: 'overlord', target: 'woo', strength: 2 },
  { source: 'overlord', target: 'executor', strength: 1.8 },
  { source: 'overlord', target: 'assessor', strength: 1.2 },
  { source: 'overlord', target: 'phoenix', strength: 1 },
  { source: 'assessor', target: 'judge', strength: 2.6 },
  { source: 'assessor', target: 'tsatse-fly', strength: 1.6 },
  { source: 'assessor', target: 'radx-flb', strength: 1.8 },
  { source: 'oracle', target: 'judge', strength: 2.2 },
  { source: 'judge', target: 'executor', strength: 2.8 },
  { source: 'executor', target: 'code-conduit', strength: 1.6 },
  { source: 'executor', target: 'radx-flb', strength: 2 },
  { source: 'tsatse-fly', target: 'radx-flb', strength: 1.4 },
  { source: 'woo', target: 'flameborn-writer', strength: 1.8 },
];

const LAYER_LABELS: { name: string; color: string; x: number; y: number }[] = [
  { name: 'SOUL LAYER', color: '#FF6B35', x: -200, y: -200 },
  { name: 'MIND LAYER', color: '#4361EE', x: 210, y: -40 },
  { name: 'BODY LAYER', color: '#06D6A0', x: -230, y: -10 },
  { name: 'META LAYER', color: '#F72585', x: 210, y: 190 },
];

const DATA_STREAM_COUNT = 18;

const createAgents = (): AgentNode[] =>
  AGENT_BLUEPRINTS.map((blueprint, index) => ({
    ...blueprint,
    x: blueprint.baseX,
    y: blueprint.baseY,
    pulse: Math.random() * Math.PI * 2,
    floatAmplitude: 8 + Math.random() * 6,
    floatSpeed: 0.8 + Math.random() * 0.6,
    floatOffset: index * 0.6,
  }));

const createDataStreams = (agents: AgentNode[]): DataNode[] => {
  const agentIds = agents.map((agent) => agent.id);
  return Array.from({ length: DATA_STREAM_COUNT }, (_, index) => ({
    id: `data-${index}`,
    anchorId: agentIds[index % agentIds.length],
    x: Math.random() * 440 - 220,
    y: Math.random() * 440 - 220,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 2 + 1,
    pulse: Math.random() * Math.PI * 2,
    color: `rgba(76, 201, 240, ${0.25 + Math.random() * 0.35})`,
  }));
};

const NetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef<HoverDetails | null>(null);
  const [hoverNode, setHoverNode] = useState<HoverDetails | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const agents = createAgents();
    const dataStreams = createDataStreams(agents);
    const nodesMap = new Map(agents.map((agent) => [agent.id, agent]));
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let animationFrameId = 0;

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const scale = Math.min(viewportWidth, viewportHeight) / 500;
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;

      let hovered: HoverDetails | null = null;
      for (const node of agents) {
        const nodeX = centerX + node.x * scale;
        const nodeY = centerY + node.y * scale;
        const distance = Math.hypot(pointerX - nodeX, pointerY - nodeY);
        const radius = node.size * scale * 0.6;
        if (distance <= radius) {
          hovered = {
            id: node.id,
            name: node.name,
            layer: node.layer,
            connections: node.connections.length,
          };
          break;
        }
      }

      hoverRef.current = hovered;
      setHoverNode(hovered);
    };

    const clearHover = () => {
      hoverRef.current = null;
      setHoverNode(null);
    };

    const drawConnections = (time: number, scale: number, centerX: number, centerY: number) => {
      CONNECTIONS.forEach((connection) => {
        const source = nodesMap.get(connection.source);
        const target = nodesMap.get(connection.target);
        if (!source || !target) {
          return;
        }

        const sourceX = centerX + source.x * scale;
        const sourceY = centerY + source.y * scale;
        const targetX = centerX + target.x * scale;
        const targetY = centerY + target.y * scale;
        const opacity = 0.15 + connection.strength * 0.08;
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = `rgba(76, 201, 240, ${opacity})`;
        ctx.lineWidth = Math.max(1, connection.strength * 0.8);
        ctx.stroke();

        const t = (time * 0.5 + connection.strength * 0.25) % 1;
        const flowX = sourceX + (targetX - sourceX) * t;
        const flowY = sourceY + (targetY - sourceY) * t;
        ctx.beginPath();
        ctx.arc(flowX, flowY, 2 + connection.strength * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#4CC9F0';
        ctx.fill();
      });
    };

    const drawDataStreams = (scale: number, centerX: number, centerY: number) => {
      dataStreams.forEach((stream) => {
        const anchor = nodesMap.get(stream.anchorId);
        if (!anchor) {
          return;
        }
        const streamX = centerX + stream.x * scale;
        const streamY = centerY + stream.y * scale;
        const anchorX = centerX + anchor.x * scale;
        const anchorY = centerY + anchor.y * scale;

        ctx.beginPath();
        ctx.moveTo(streamX, streamY);
        ctx.lineTo(anchorX, anchorY);
        ctx.strokeStyle = 'rgba(76, 201, 240, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        const radius = Math.max(1.2, stream.size * scale * (1 + Math.sin(stream.pulse) * 0.4));
        ctx.beginPath();
        ctx.arc(streamX, streamY, radius, 0, Math.PI * 2);
        ctx.fillStyle = stream.color;
        ctx.fill();
      });
    };

    const drawAgents = (time: number, scale: number, centerX: number, centerY: number) => {
      agents.forEach((node) => {
        node.pulse = (node.pulse + 0.05) % (Math.PI * 2);
        const floatX = Math.sin(time * node.floatSpeed + node.floatOffset) * node.floatAmplitude;
        const floatY = Math.cos(time * (node.floatSpeed * 0.8) + node.floatOffset) * node.floatAmplitude * 0.6;
        node.x = node.baseX + floatX;
        node.y = node.baseY + floatY;

        const nodeX = centerX + node.x * scale;
        const nodeY = centerY + node.y * scale;
        const pulseFactor = 1 + Math.sin(node.pulse) * 0.08;
        const radius = node.size * scale * 0.5 * pulseFactor;

        const glowRadius = radius * 2.5;
        const gradient = ctx.createRadialGradient(nodeX, nodeY, radius * 0.4, nodeX, nodeY, glowRadius);
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.5, node.color + '99');
        gradient.addColorStop(1, node.color + '00');
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nodeX, nodeY, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        if (['radx-flb', 'deepcal-core'].includes(node.id)) {
          const highlightRadius = radius * (node.id === 'radx-flb' ? 2.7 : 2.2);
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, highlightRadius, 0, Math.PI * 2);
          ctx.strokeStyle =
            node.id === 'radx-flb'
              ? `rgba(247, 37, 133, ${0.2 + Math.sin(time * 6) * 0.1})`
              : `rgba(76, 201, 240, ${0.25 + Math.sin(time * 5) * 0.1})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        if (!hoverRef.current && scale > 0.9) {
          ctx.font = `${Math.max(10, 14 * scale)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(node.name, nodeX, nodeY);
        }
      });
    };

    const drawLayerLabels = (scale: number, centerX: number, centerY: number) => {
      ctx.font = `${Math.max(10, 12 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      LAYER_LABELS.forEach((label) => {
        const x = centerX + label.x * scale;
        const y = centerY + label.y * scale;
        ctx.fillStyle = label.color + '55';
        ctx.fillText(label.name, x, y);
      });
    };

    const updateDataStreams = () => {
      dataStreams.forEach((stream) => {
        stream.x += stream.vx;
        stream.y += stream.vy;
        stream.pulse = (stream.pulse + 0.1) % (Math.PI * 2);

        if (stream.x < -260) stream.x = 260;
        if (stream.x > 260) stream.x = -260;
        if (stream.y < -220) stream.y = 220;
        if (stream.y > 220) stream.y = -220;
      });
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      const time = performance.now() / 1000;
      const scale = Math.min(viewportWidth, viewportHeight) / 500;
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      drawConnections(time, scale, centerX, centerY);
      drawDataStreams(scale, centerX, centerY);
      drawAgents(time, scale, centerX, centerY);
      drawLayerLabels(scale, centerX, centerY);
      updateDataStreams();
    };

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', clearHover);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', clearHover);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />

      {hoverNode && (
        <div className="pointer-events-none absolute left-6 top-6 max-w-xs rounded-lg border border-cyan-600/60 bg-black/80 p-4 text-sm text-cyan-100 shadow-lg backdrop-blur-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-500">Agent Online</div>
          <div className="mt-1 text-xl font-semibold text-cyan-200">{hoverNode.name}</div>
          <div className="mt-2 flex items-center justify-between text-cyan-400/80">
            <span className="capitalize">{hoverNode.layer} layer</span>
            <span>{hoverNode.connections} channels</span>
          </div>
          {hoverNode.id === 'radx-flb' && (
            <div className="mt-3 rounded border border-fuchsia-500/50 bg-fuchsia-500/10 px-2 py-1 text-xs text-fuchsia-300">
              ⚡ Live Security Response: Threat neutralized · 23.45.67.89
            </div>
          )}
          {hoverNode.id === 'deepcal-core' && (
            <div className="mt-3 rounded border border-cyan-500/50 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200">
              📊 Data Throughput: 24.7 TB / second · Adaptive decision lattice active
            </div>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-6 right-6 rounded-lg border border-cyan-700/50 bg-black/70 p-3 text-xs text-cyan-200 backdrop-blur-sm">
        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-500">MoStar Grid</div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#4CC9F0]" />
            <span>Core Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#4361EE]" />
            <span>Mind Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#06D6A0]" />
            <span>Body Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF6B35]" />
            <span>Soul Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#F72585]" />
            <span>Meta Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
