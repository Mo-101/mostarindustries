import React from 'react';
import { Globe2, Server, Database, Wifi, Zap } from 'lucide-react';
import { AINode } from '../../../types/ai-hub';
import MapboxGlobe from '../MapboxGlobe';

interface NetworkTabProps {
  aiNodes: AINode[];
  isLoadingNodes: boolean;
}

const NetworkTab: React.FC<NetworkTabProps> = ({ aiNodes, isLoadingNodes }) => {
  const totalActive = aiNodes.filter(n => n.status === 'Active').length;
  const avgPerformance =
    aiNodes.length > 0
      ? Math.round(aiNodes.reduce((acc, n) => acc + n.performance, 0) / aiNodes.length)
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-full bg-mostar-green/10 border border-mostar-green/30">
          <Globe2 className="h-6 w-6 text-mostar-green" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">
            Neural Grid Monitor
          </h3>
          <p className="text-xs text-white/60 font-mono">
            Live AI Node Map — NeonDB + Supabase Hybrid Sync
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🌍 Globe Visualization */}
        <div className="lg:col-span-2 relative">
          <div className="bg-black/30 rounded-lg border border-mostar-green/20 h-[400px] relative overflow-hidden">
            <MapboxGlobe aiNodes={aiNodes} />
            <div className="absolute bottom-4 right-4 text-xs text-white/50 font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
              Sync Status: <span className="text-mostar-green">Stable</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="glassmorphism rounded-lg p-4 border border-mostar-green/10">
              <h4 className="font-mono text-sm text-white/70 mb-2">Active Nodes</h4>
              <div className="text-3xl font-display text-mostar-green">
                {isLoadingNodes ? '...' : totalActive}
              </div>
              <div className="text-xs text-white/50 mt-1">+8% since last sync</div>
            </div>

            <div className="glassmorphism rounded-lg p-4 border border-mostar-cyan/10">
              <h4 className="font-mono text-sm text-white/70 mb-2">Network Throughput</h4>
              <div className="text-3xl font-display text-mostar-cyan">2.6 PB</div>
              <div className="text-xs text-white/50 mt-1">↑ 4.2% in last 24h</div>
            </div>

            <div className="glassmorphism rounded-lg p-4 border border-mostar-light-blue/10">
              <h4 className="font-mono text-sm text-white/70 mb-2">Avg Performance</h4>
              <div className="text-3xl font-display text-mostar-light-blue">
                {isLoadingNodes ? '...' : `${avgPerformance}%`}
              </div>
              <div className="text-xs text-white/50 mt-1">System Load Balanced</div>
            </div>
          </div>
        </div>

        {/* 🧩 Node List / Status */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-display font-bold mb-4 text-white">Node Status</h3>
          <div className="bg-black/30 rounded-lg border border-mostar-green/10 h-[500px] overflow-y-auto shadow-inner shadow-mostar-green/10">
            <div className="p-4 border-b border-mostar-green/10 flex items-center justify-between">
              <span className="font-mono text-sm text-white/70">NEON GRID NODES</span>
              <button className="text-xs text-mostar-green hover:text-mostar-cyan transition-colors">
                Refresh
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {isLoadingNodes ? (
                <div className="p-4 text-center text-white/50 font-mono">Loading node data...</div>
              ) : (
                aiNodes.map((node, index) => (
                  <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            node.status === 'Active'
                              ? 'bg-mostar-green animate-pulse'
                              : 'bg-mostar-magenta'
                          } mr-2`}
                        ></div>
                        <span className="font-mono text-sm">{node.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          node.status === 'Active'
                            ? 'bg-mostar-green/10 text-mostar-green'
                            : 'bg-mostar-magenta/10 text-mostar-magenta'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <div className="text-xs text-white/50 mb-1">Region: {node.location}</div>
                    <div className="text-xs text-white/50 mb-2 flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-mostar-cyan" /> Link: Stable
                    </div>

                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-mostar-green to-mostar-cyan transition-all duration-500"
                        style={{ width: `${node.performance}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/50">Performance</span>
                      <span className="text-xs text-white/70">{node.performance}%</span>
                    </div>

                    <div className="mt-2 text-xs text-white/40 flex items-center gap-1">
                      <Server className="w-3 h-3" /> grid.mostar.tech
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center justify-between text-xs text-white/50 mt-3 font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-mostar-green" />
              <span>Neon Core: Synced</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-mostar-cyan animate-pulse" />
              <span>Supabase Realtime: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTab;
