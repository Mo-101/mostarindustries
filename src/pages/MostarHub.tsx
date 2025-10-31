import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Shield, Globe, Database, Brain as BrainIcon, Zap, Activity, Server, CloudLightning, Satellite } from 'lucide-react';
import LoadingOverlay from '../components/hub/LoadingOverlay';
import HeroSection from '../components/hub/HeroSection';
import HubTabs from '../components/hub/HubTabs';
import OverviewTab from '../components/hub/tabs/OverviewTab';
import NetworkTab from '../components/hub/tabs/NetworkTab';
import SecurityTab from '../components/hub/tabs/SecurityTab';
import AnalyticsTab from '../components/hub/tabs/AnalyticsTab';
import CommandTab from '../components/hub/tabs/CommandTab';
import MusicPlayer from '../components/hub/MusicPlayer';
import { fetchAINodes } from '../services/aiNodeService';
import { ActivityFeedItem, ChartDataPoint } from '../types/ai-hub';

const MostarHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const { data: aiNodes = [], isLoading: isLoadingNodes } = useQuery({
    queryKey: ['aiNodes'],
    queryFn: fetchAINodes,
    staleTime: 30000,
  });

  // === Live Activity Feed — Reflecting True MoStar Operations ===
  const activityFeed: ActivityFeedItem[] = [
    {
      id: 1,
      type: 'diagnosis',
      message: 'Assessor processed 342 new environmental signals — 28 flagged for contamination risk. Judge reviewing ethics layer.',
      time: '47 seconds ago',
      icon: <Activity className="h-5 w-5 text-mostar-magenta" />,
    },
    {
      id: 2,
      type: 'coordination',
      message: 'Overlord synchronized state across 9 agents — grid harmony restored to 99.97%.',
      time: '3 minutes ago',
      icon: <Zap className="h-5 w-5 text-mostar-light-blue" />,
    },
    {
      id: 3,
      type: 'integration',
      message: 'Code Conduit relayed diagnostics from NeonDB to Judge & Executor layers — all transaction hashes verified.',
      time: '9 minutes ago',
      icon: <Database className="h-5 w-5 text-mostar-cyan" />,
    },
    {
      id: 4,
      type: 'doctrine',
      message: 'Oracle (Flame Born Writer) updated Doctrine manifest v3.4 — approved by Ethics Council. Ethos sync distributed.',
      time: '14 minutes ago',
      icon: <BrainIcon className="h-5 w-5 text-mostar-green" />,
    },
    {
      id: 5,
      type: 'medical',
      message: 'RAD-X-FLB completed pathogen cluster modeling across 54 regions — new predictive layer deployed to Grid.',
      time: '24 minutes ago',
      icon: <Server className="h-5 w-5 text-mostar-yellow" />,
    },
    {
      id: 6,
      type: 'policy',
      message: 'TsaTse Fly completed transparency reform map for Central Authority nodes — awaiting Overlord signature.',
      time: '38 minutes ago',
      icon: <Globe className="h-5 w-5 text-mostar-cyan" />,
    },
    {
      id: 7,
      type: 'stabilization',
      message: 'Woo balanced user sentiment metrics — emotional resonance stable at 98.4%.',
      time: '1 hour ago',
      icon: <BrainIcon className="h-5 w-5 text-mostar-pink" />,
    },
    {
      id: 8,
      type: 'security',
      message: 'Executor neutralized rogue data packet in Layer 7 — quarantine success. System audit by Assessor pending.',
      time: '1 hour 20 minutes ago',
      icon: <Shield className="h-5 w-5 text-mostar-red" />,
    },
    {
      id: 9,
      type: 'satellite',
      message: 'New orbital relay from SentinelNet connected — global telemetry expanded by 11%.',
      time: '2 hours ago',
      icon: <Satellite className="h-5 w-5 text-mostar-purple" />,
    },
  ];

  // === Overlord Grid Harmony — System Performance Graph ===
  const performanceData: ChartDataPoint[] = [
    { name: '00:00', value: 93 },
    { name: '03:00', value: 94 },
    { name: '06:00', value: 96 },
    { name: '09:00', value: 98 },
    { name: '12:00', value: 99 },
    { name: '15:00', value: 97 },
    { name: '18:00', value: 99 },
    { name: '21:00', value: 98 },
    { name: '24:00', value: 99 },
  ];

  // === AI System Load — Reflecting All 9 MoStar Agents ===
  const aiSystemsData: ChartDataPoint[] = [
    { name: 'Overlord (Cognitive Core)', value: 22 },
    { name: 'Assessor (Signal Analysis)', value: 15 },
    { name: 'Judge (Verdict Engine)', value: 14 },
    { name: 'Executor (Action Layer)', value: 13 },
    { name: 'Oracle (Doctrine Keeper)', value: 10 },
    { name: 'Code Conduit (Bridge)', value: 8 },
    { name: 'RAD-X-FLB (Health AI)', value: 7 },
    { name: 'TsaTse Fly (Policy AI)', value: 6 },
    { name: 'Woo (Emotional AI)', value: 5 },
  ];

  // === Security Integrity — Grid Event Reports ===
  const securityData: ChartDataPoint[] = [
    { name: 'Mon', value: 8 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 10 },
    { name: 'Thu', value: 6 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 12 },
    { name: 'Sun', value: 5 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="scanline"></div>
      <Navbar />
      <MusicPlayer />

      <main className="flex-grow pt-20">
        <HeroSection />

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="glassmorphism rounded-lg border border-white/10 p-6 mb-8">
              <HubTabs activeTab={activeTab} handleTabChange={handleTabChange} />

              {activeTab === 'overview' && (
                <OverviewTab
                  performanceData={performanceData}
                  securityData={securityData}
                  aiSystemsData={aiSystemsData}
                  activityFeed={activityFeed}
                  aiNodes={aiNodes}
                  isLoadingNodes={isLoadingNodes}
                />
              )}

              {activeTab === 'network' && (
                <NetworkTab aiNodes={aiNodes} isLoadingNodes={isLoadingNodes} />
              )}

              {activeTab === 'security' && (
                <SecurityTab securityData={securityData} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab performanceData={performanceData} />
              )}

              {activeTab === 'command' && <CommandTab />}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MostarHub;
