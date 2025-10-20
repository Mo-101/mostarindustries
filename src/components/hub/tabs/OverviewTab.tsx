import React from 'react';
import { Server, Shield, Brain, Database, Globe2, Activity, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ActivityFeedItem, AINode, ChartDataPoint } from '../../../types/ai-hub';

interface OverviewTabProps {
  performanceData: ChartDataPoint[];
  securityData: ChartDataPoint[];
  aiSystemsData: ChartDataPoint[];
  activityFeed: ActivityFeedItem[];
  aiNodes: AINode[];
  isLoadingNodes: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  performanceData,
  securityData,
  aiSystemsData,
  activityFeed,
  aiNodes,
  isLoadingNodes,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-full bg-mostar-cyan/10 border border-mostar-cyan/30">
          <Brain className="h-6 w-6 text-mostar-cyan" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Overlord System Overview</h3>
          <p className="text-xs text-white/60 font-mono">
            NeonDB–Supabase Hybrid Core Telemetry
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Charts Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* AI Performance */}
            <div className="bg-black/30 rounded-lg p-4 border border-mostar-cyan/10">
              <h4 className="font-mono text-sm text-white/70 mb-2">
                Overlord Cognitive Performance
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00eaff" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#00eaff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(10, 14, 23, 0.8)',
                        borderColor: 'rgba(0, 234, 255, 0.3)',
                      }}
                      labelStyle={{ color: '#00eaff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#00eaff"
                      fillOpacity={1}
                      fill="url(#performanceFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="bg-black/30 rounded-lg p-4 border border-mostar-magenta/10">
              <h4 className="font-mono text-sm text-white/70 mb-2">
                Security Integrity Events
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={securityData}>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(10, 14, 23, 0.8)',
                        borderColor: 'rgba(248, 28, 229, 0.3)',
                      }}
                      labelStyle={{ color: '#f81ce5' }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#f81ce5"
                      radius={[4, 4, 0, 0]}
                      animationDuration={600}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI System Pie */}
          <div className="bg-black/30 rounded-lg p-4 border border-mostar-green/10">
            <h4 className="font-mono text-sm text-white/70 mb-3">AI System Distribution</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiSystemsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {aiSystemsData.map((_, index) => {
                      const colors = [
                        '#00eaff',
                        '#00ff9d',
                        '#f81ce5',
                        '#ffca00',
                        '#00ffff',
                        '#0085ff',
                        '#aaff00',
                      ];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 14, 23, 0.8)',
                      borderColor: 'rgba(0, 234, 255, 0.3)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hybrid Sync Status */}
          <div className="flex items-center justify-between mt-4 text-xs text-white/60 font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-mostar-green" />
              NeonDB Sync: <span className="text-mostar-green">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-mostar-cyan animate-pulse" />
              Supabase Mirror: <span className="text-mostar-cyan">Stable</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-display font-bold mb-4 text-white">
            Live Activity Feed
          </h3>
          <div className="bg-black/30 rounded-lg border border-mostar-cyan/10 h-[520px] overflow-y-auto shadow-inner shadow-mostar-cyan/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-mono text-sm text-white/70">REAL-TIME INTEL</span>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-mostar-green animate-pulse mr-2"></div>
                <span className="text-xs text-mostar-green">LIVE</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start mb-2">
                    {activity.icon}
                    <div className="ml-3">
                      <p className="text-white text-sm">{activity.message}</p>
                      <span className="text-white/50 text-xs">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoadingNodes ? (
                <div className="p-4 text-center text-white/50 font-mono">
                  Loading node data...
                </div>
              ) : (
                aiNodes.slice(0, 6).map((node, index) => (
                  <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start mb-2">
                      <Server className="h-5 w-5 text-mostar-cyan" />
                      <div className="ml-3">
                        <p className="text-white text-sm">
                          Node {node.name} reports {node.performance}% efficiency
                        </p>
                        <span className="text-white/50 text-xs">
                          {new Date(node.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
