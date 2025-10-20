import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartDataPoint } from '../../../types/ai-hub';
import { Brain, Zap } from 'lucide-react';

interface AnalyticsTabProps {
  performanceData: ChartDataPoint[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ performanceData }) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-full bg-mostar-cyan/10 border border-mostar-cyan/30">
          <Brain className="h-6 w-6 text-mostar-cyan" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Analytics & Doctrine</h3>
          <p className="text-xs text-white/60 font-mono">Oracle Cognitive Analytics Layer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-black/20 rounded-lg p-4 border border-mostar-cyan/20">
          <h4 className="font-mono text-sm text-white/70 mb-2">AI Cognitive Performance</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,14,23,0.85)', borderColor: 'rgba(0,255,255,0.3)' }}
                  labelStyle={{ color: '#00ffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00ffff" 
                  strokeWidth={2} 
                  dot={{ r: 4, stroke: '#00ffff', fill: '#121212' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctrine Stats */}
        <div className="glassmorphism rounded-lg p-6 border border-mostar-cyan/10">
          <h4 className="font-mono text-sm text-white/70 mb-6">Doctrine Composition Metrics</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {[
                { label: 'Predictive Analytics', value: 25, color: 'mostar-light-blue' },
                { label: 'Neural Networks', value: 30, color: 'mostar-cyan' },
                { label: 'ML Algorithms', value: 20, color: 'mostar-green' },
              ].map(({ label, value, color }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white">{label}</span>
                    <span className={`text-xs text-${color}`}>{value}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className={`h-full bg-${color}`} style={{ width: `${value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {[
                { label: 'Data Fusion', value: 15, color: 'mostar-magenta' },
                { label: 'Quantum Computing', value: 10, color: 'mostar-yellow' },
              ].map(({ label, value, color }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white">{label}</span>
                    <span className={`text-xs text-${color}`}>{value}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className={`h-full bg-${color}`} style={{ width: `${value}%` }}></div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-xs text-white font-medium">Efficiency Rating</span>
                <span className="text-xs text-mostar-green font-medium">94.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
