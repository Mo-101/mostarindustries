import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([
    { name: '00:00', aiNodes: 4735, threats: 120, verdicts: 84, ethos: 6, health: 99.1, environmental: 78 },
    { name: '04:00', aiNodes: 4800, threats: 136, verdicts: 95, ethos: 8, health: 98.9, environmental: 81 },
    { name: '08:00', aiNodes: 4890, threats: 149, verdicts: 102, ethos: 9, health: 99.2, environmental: 84 },
    { name: '12:00', aiNodes: 5100, threats: 171, verdicts: 118, ethos: 11, health: 99.8, environmental: 86 },
    { name: '16:00', aiNodes: 5320, threats: 165, verdicts: 124, ethos: 13, health: 99.5, environmental: 88 },
    { name: '20:00', aiNodes: 5200, threats: 152, verdicts: 112, ethos: 9, health: 99.7, environmental: 84 },
    { name: '24:00', aiNodes: 5070, threats: 144, verdicts: 98, ethos: 7, health: 99.9, environmental: 83 },
  ]);

  // === Expanded Metrics reflecting the full MoStar ecosystem ===
  const metrics = [
    { id: 1, name: 'Active AI Nodes', value: '5,270', change: '+14.2%', color: 'blue' },
    { id: 2, name: 'Threats Neutralized', value: '13,804', change: '+8.1%', color: 'magenta' },
    { id: 3, name: 'Ethical Verdicts Issued', value: '742', change: '+5.9%', color: 'green' },
    { id: 4, name: 'Doctrine Syncs (Oracle)', value: '23', change: '+2.4%', color: 'yellow' },
    { id: 5, name: 'Federated Health Signals', value: '1,932', change: '+9.7%', color: 'cyan' },
    { id: 6, name: 'Policy Drafts (TsaTse)', value: '12', change: '+1.3%', color: 'purple' },
    { id: 7, name: 'Emotional Resonance', value: '98.7%', change: '+0.4%', color: 'pink' },
  ];

  // === Real-time Simulation ===
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          aiNodes: item.aiNodes + Math.floor(Math.random() * 50 - 25),
          threats: item.threats + Math.floor(Math.random() * 6 - 3),
          verdicts: Math.max(50, item.verdicts + Math.floor(Math.random() * 8 - 4)),
          ethos: Math.max(0, item.ethos + Math.floor(Math.random() * 3 - 1)),
          health: Math.min(100, Math.max(95, item.health + (Math.random() * 0.8 - 0.4))),
          environmental: Math.min(100, Math.max(70, item.environmental + (Math.random() * 1.5 - 0.7))),
        }))
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-10 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-mostar-magenta/10 text-mostar-magenta font-mono text-xs mb-3">
            LIVE INTEL — GRID STATUS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-purple-magenta-gradient text-gradient">
            MoStar Global Intelligence Network
          </h2>
          <p className="max-w-2xl mx-auto text-white/70">
            Unified telemetry feed from all 9 MoStar agents — real-time operational metrics,
            doctrine updates, and system health across the Neon-connected grid.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="glassmorphism rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-mono text-sm text-white/70">{metric.name}</h3>
                <span className={`text-xs px-2 py-1 rounded bg-mostar-${metric.color}/10 text-mostar-${metric.color}`}>
                  {metric.change}
                </span>
              </div>
              <div className={`text-2xl font-display font-bold text-mostar-${metric.color} text-glow-${metric.color}`}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="glassmorphism rounded-lg border border-white/10 p-6">
          <div className="flex flex-col md:flex-row items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white">Operational Analytics</h3>
              <p className="text-white/70 text-sm">
                Tracking node activity, threat control, verdict cycles, and doctrine updates.
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <div className="px-3 py-1 rounded-full bg-mostar-blue/10 border border-mostar-blue/30 text-mostar-light-blue text-xs">
                LIVE
              </div>
              <div className="px-3 py-1 rounded-full border border-mostar-blue/30 text-white/70 text-xs">
                7D
              </div>
              <div className="px-3 py-1 rounded-full border border-mostar-blue/30 text-white/70 text-xs">
                30D
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Nodes */}
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <h4 className="font-mono text-sm text-white/70 mb-4">Active AI Nodes</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="aiNodesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#33a1ff" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#33a1ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.8)', borderColor: '#33a1ff' }} />
                    <Area type="monotone" dataKey="aiNodes" stroke="#33a1ff" fillOpacity={1} fill="url(#aiNodesFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verdicts */}
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <h4 className="font-mono text-sm text-white/70 mb-4">Ethical Verdicts (Assessor / Judge)</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.8)', borderColor: 'rgba(0,255,157,0.3)' }} />
                    <Bar dataKey="verdicts" fill="#00ff9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Doctrine Updates */}
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <h4 className="font-mono text-sm text-white/70 mb-4">Doctrine Updates (Oracle)</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10,14,23,0.8)', borderColor: 'rgba(255,230,0,0.3)' }} />
                    <Line type="monotone" dataKey="ethos" stroke="#ffee00" strokeWidth={2} dot={{ r: 4, stroke: '#ffee00', fill: '#121212' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <h4 className="font-mono text-sm text-white/70 mb-4">System Health (Overlord)</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)' }} domain={[95, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10,14,23,0.8)', borderColor: 'rgba(0,255,157,0.3)' }} />
                    <Line type="monotone" dataKey="health" stroke="#00ff9d" strokeWidth={2} dot={{ r: 4, stroke: '#00ff9d', fill: '#121212' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Legend + Status */}
          <div className="flex justify-between items-center mt-6 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-mostar-blue"></div><span>AI Nodes</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-mostar-magenta"></div><span>Threats</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-mostar-green"></div><span>Verdicts</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-mostar-yellow"></div><span>Doctrine Updates</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-mostar-cyan"></div><span>Health / Env.</span></div>
            </div>
            <div className="text-xs text-white/50 font-mono flex items-center">
              <div className="w-2 h-2 rounded-full bg-mostar-green animate-pulse mr-2"></div>
              SYNCHRONIZED — NEONDB LIVE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
