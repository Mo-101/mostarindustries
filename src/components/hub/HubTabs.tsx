
import React from 'react';
import { Activity, Network, Shield, Brain, Terminal, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface HubTabsProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

const HubTabs: React.FC<HubTabsProps> = ({ activeTab, handleTabChange }) => {
  // === Updated Tabs reflecting MoStar Grid subsystems ===
  const tabs = [
    { 
      id: 'overview', 
      label: 'Grid Overview', 
      description: 'Unified system view — Overlord coordination across all agents.',
      icon: <Activity className="h-4 w-4" /> 
    },
    { 
      id: 'network', 
      label: 'Network Grid', 
      description: 'Map of AI nodes, inter-agent connections, and live data bridges.',
      icon: <Network className="h-4 w-4" /> 
    },
    { 
      id: 'security', 
      label: 'Security & Justice', 
      description: 'Threat neutralization, ethical verdicts, and system integrity logs.',
      icon: <Shield className="h-4 w-4" /> 
    },
    { 
      id: 'analytics', 
      label: 'Analytics & Doctrine', 
      description: 'AI cognition metrics, data fusion insights, and Clear Flame doctrine syncs.',
      icon: <Brain className="h-4 w-4" /> 
    },
    { 
      id: 'command', 
      label: 'Command Matrix', 
      description: 'Direct control and operational dispatch — Overlord supervision protocols.',
      icon: <Terminal className="h-4 w-4" /> 
    },
  ];

  const onTabChange = (tab: string) => {
    const selectedTab = tabs.find(t => t.id === tab);
    handleTabChange(tab);

    toast(`${selectedTab?.label} activated`, {
      description: selectedTab?.description,
      icon: <Zap className="h-5 w-5 text-mostar-cyan" />,
      style: { background: 'rgba(10,14,23,0.9)', border: '1px solid rgba(0,255,255,0.2)', color: '#00ffff' },
    });
  };

  return (
    <div className="flex flex-wrap mb-6 border-b border-white/10 pb-4">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onTabChange(tab.id)} 
          className={`px-4 py-2 mr-2 mb-2 rounded-md font-mono text-sm transition-all ${
            activeTab === tab.id ? 
              tab.id === 'overview' ? 'bg-mostar-blue/20 text-mostar-light-blue' : 
              tab.id === 'network' ? 'bg-mostar-green/20 text-mostar-green' :
              tab.id === 'security' ? 'bg-mostar-magenta/20 text-mostar-magenta' :
              tab.id === 'analytics' ? 'bg-mostar-cyan/20 text-mostar-cyan' :
              'bg-mostar-yellow/20 text-mostar-yellow' 
            : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default HubTabs;
