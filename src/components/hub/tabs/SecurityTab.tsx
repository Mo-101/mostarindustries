import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Zap, Database, Lock, Activity, Server } from 'lucide-react';
import { ChartDataPoint } from '../../../types/ai-hub';

interface SecurityTabProps {
  securityData: ChartDataPoint[];
}

const SecurityTab: React.FC<SecurityTabProps> = ({ securityData }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-full bg-mostar-magenta/10 border border-mostar-magenta/30">
          <Shield className="h-6 w-6 text-mostar-magenta" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">
            Overlord Defense Matrix
          </h3>
          <p className="text-xs text-white/60 font-mono">
            Hybrid Security Core — NeonDB + Supabase Quantum Sync
          </p>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glassmorphism rounded-lg p-4 border border-mostar-green/10">
          <h4 className="font-mono text-sm text-white/70 mb-2">Threat Level</h4>
          <div className="text-3xl font-display text-mostar-green animate-pulse">Low</div>
          <div className="text-xs text-white/50 mt-1">System secure and stable</div>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-mostar-cyan/10">
          <h4 className="font-mono text-sm text-white/70 mb-2">Incidents Today</h4>
          <div className="text-3xl font-display text-mostar-cyan">14</div>
          <div className="text-xs text-white/50 mt-1">-3 vs. previous cycle</div>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-mostar-light-blue/10">
          <h4 className="font-mono text-sm text-white/70 mb-2">Resolution Rate</h4>
          <div className="text-3xl font-display text-mostar-light-blue">99.8%</div>
          <div className="text-xs text-white/50 mt-1">+0.3% system gain</div>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-mostar-magenta/10">
          <h4 className="font-mono text-sm text-white/70 mb-2">Response Time</h4>
          <div className="text-3xl font-display text-mostar-magenta">1.2s</div>
          <div className="text-xs text-white/50 mt-1">Quantum optimized</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Chart */}
        <div className="lg:col-span-2">
          <div className="bg-black/30 rounded-lg p-4 border border-mostar-magenta/10">
            <h4 className="font-mono text-sm text-white/70 mb-4">Weekly Threat Analysis</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityData}>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10,14,23,0.9)',
                      borderColor: 'rgba(248,28,229,0.3)',
                    }}
                    labelStyle={{ color: '#f81ce5' }}
                  />
                  <Bar
                    dataKey="value"
                    name="Incidents"
                    fill="#f81ce5"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-xs text-white/60 font-mono">
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3 text-mostar-green" />
                NeonDB Logs: <span className="text-mostar-green">Synced</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-mostar-cyan animate-pulse" />
                Supabase Stream: <span className="text-mostar-cyan">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Protocols */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 rounded-lg p-4 border border-mostar-green/10 h-full shadow-inner shadow-mostar-green/10">
            <h4 className="font-mono text-sm text-white/70 mb-4">Defense Subsystems</h4>
            <div className="space-y-5">
              {[
                {
                  label: 'Firewall Integrity',
                  value: 100,
                  color: 'bg-mostar-green',
                  status: 'Active',
                },
                {
                  label: 'Encryption Layer',
                  value: 100,
                  color: 'bg-mostar-cyan',
                  status: 'Quantum-256 AES',
                },
                {
                  label: 'Intrusion Detection',
                  value: 97,
                  color: 'bg-mostar-yellow',
                  status: 'Adaptive AI Mode',
                },
                {
                  label: 'Threat Intelligence Sync',
                  value: 92,
                  color: 'bg-mostar-magenta',
                  status: 'Updating',
                },
                {
                  label: 'Authentication Matrix',
                  value: 100,
                  color: 'bg-mostar-green',
                  status: 'Multi-Factor',
                },
              ].map((system, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white">{system.label}</span>
                    <span className="text-xs text-mostar-cyan">{system.status}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${system.color} transition-all duration-700`}
                      style={{ width: `${system.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Defense Pulse */}
            <div className="mt-6 flex items-center justify-between text-xs text-white/50 font-mono">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-mostar-green animate-pulse" />
                Defense Sync: <span className="text-mostar-green">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-3 h-3 text-mostar-cyan" />
                Node Mesh: <span className="text-mostar-cyan">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
