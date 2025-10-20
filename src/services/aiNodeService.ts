
import { AINode } from '../types/ai-hub';
import { fetchGridSignals } from './gridService';

export const fetchAINodes = async (): Promise<AINode[]> => {
  try {
    const signals = await fetchGridSignals();
    
    return signals.map((signal: any, index: number) => ({
      id: signal.id || index,
      name: `Node-${signal.location || index}`,
      status: signal.odu < 50 ? 'Active' : 'Alert',
      config: { odu: signal.odu, verdict: signal.verdict },
      location: signal.location,
      lastUpdated: signal.timestamp,
      performance: Math.max(0, 100 - signal.odu),
      threats: signal.odu > 100 ? 50 : signal.odu / 2,
    }));
  } catch (error) {
    console.error('Error fetching AI nodes:', error);
    return [];
  }
};
